import random
from icecream import ic
from . import models, serializers, filters
from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.authtoken.models import Token


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    if request.method == "POST":
        try:
            serializer = serializers.UserSerializer(data=request.data)
            if not request.data.get("email"):
                return Response(
                    {"email": "Please Provide your Mail Address"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if serializer.is_valid():
                if User.objects.filter(email=request.data["email"]).exists():
                    return Response(
                        {"message": ["Email Already Exists"]},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                if models.Customer.objects.filter(phone=request.data["phone"]).exists():
                    return Response(
                        {"message": ["Phone Number Already Exists"]},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                user = serializer.save()
                token, created = Token.objects.get_or_create(user=user)
                group = Group.objects.get_or_create(name="Customer")[0]
                user.groups.add(group)
                cont = serializer.data
                cont["token"] = token.key
                cont["groups"] = [group.name]
                cont["message"] = "User Created Successfully"
                return Response(cont, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            ic(e)
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CustomAuthToken(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            username = request.data.get("username")
            password = request.data.get("password")
            if username is None or password is None:
                raise Exception
        except:
            return Response(
                {"error": "Please Provide Username and Password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response(
                {"token": token.key, "username": user.username, "email": user.email},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST
            )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    cont = {"user": request.user.username, "message": "Logout Successfully"}
    return Response(cont)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def checkAuth(request):
    return Response({"message": "Authenticated", "username": request.user.username})


@api_view(["GET"])
@permission_classes([AllowAny])
def getCategories(request):
    categories = models.Category.objects.all()
    serializer = serializers.CategorySerializer(categories, many=True)
    cont = {
        "message": "Success",
        "data": serializer.data,
    }
    return Response(cont)


class ProductListView(generics.ListAPIView):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = filters.ProductFilter
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.query_params.get("search", None)
        if query:
            queryset = queryset.filter(name__icontains=query)
        return queryset

    def format_product(self, product):
        images = models.ProductImages.objects.filter(product=product)
        discount_percentage = (
            1 - (float(product.selling_price) / float(product.market_price))
        ) * 100
        badge = (
            "Hot"
            if product.buy_count > 100
            else f"-{int(discount_percentage)}%" if discount_percentage > 0 else None
        )
        return {
            "id": product.id,
            "slug": product.slug,
            "img1": str(images[0].image.url) if len(images) > 0 else None,
            "img2": str(images[1].image.url) if len(images) > 1 else None,
            "rating": random.randint(1, 5),
            "oldPrice": product.market_price,
            "newPrice": product.selling_price,
            "badge": badge,
            "category": (
                product.categories[0].name if product.categories else "Uncategorized"
            ),
            "name": product.name,
        }

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        formatted_products = [self.format_product(product) for product in queryset]
        return Response({"products": formatted_products})


@api_view(["GET"])
@permission_classes([AllowAny])
def getcolors(request):
    colors = models.Color.objects.all()
    serializer = serializers.ColorSerializer(colors, many=True)
    cont = {
        "message": "Success",
        "data": serializer.data,
    }
    return Response(cont)


@api_view(["GET"])
@permission_classes([AllowAny])
def getsizes(request):
    sizes = models.Size.objects.all()
    serializer = serializers.SizeSerializer(sizes, many=True)
    cont = {
        "message": "Success",
        "data": serializer.data,
    }
    return Response(cont)


@api_view(["POST"])
@permission_classes([AllowAny])
def makeSubscription(request):
    if request.method == "POST":
        serializer = serializers.SubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Subscribed Successfully"})
        return Response(serializer.errors)


@api_view(["GET"])
@permission_classes([AllowAny])
def getProduct(request, slug):
    if request.method == "GET":
        cont = {}
        try:
            product = models.Product.objects.get(slug=slug)
            cont["product"] = serializers.ProductSerializer(product).data
            product_variants = models.ProductGroup.objects.filter(product=product).first()
            cont["variants"] = serializers.ProductGroupSerial(product_variants).data
            return Response(cont)
        except models.Product.DoesNotExist:
            return Response(
                {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def addCartItem(request):
    if request.method == "POST":
        ciSerial = serializers.CartItemSerializer(data=request.data)
        user = models.Customer.objects.get(user=request.user)
        product = models.Product.objects.get(id=request.data["product"])
        size = request.data["size"]
        if user.cart.filter(product=product, size=size).exists():
            ciid = user.cart.get(product=product, size=size).id
            cartItem = models.CartItem.objects.get(id=ciid)
            cartItem.quantity += 1
            cartItem.save()
            return Response({"message": "Success"})
        elif ciSerial.is_valid():
            ciSerial.save()
            user.cart.add(ciSerial.instance)
            user.save()
            return Response({"message": "Success"})
        return Response(ciSerial.errors)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def updateCartItem(request):
    if request.method == "POST":
        user = models.Customer.objects.get(user=request.user)
        cartItem = models.CartItem.objects.get(id=request.data["id"])
        quantity = request.data["quantity"]
        cd = request.data["cd"]
        if cd or quantity == 0:
            user.cart.remove(cartItem)
            cartItem.delete()
            cart = user.cart.all()
            cartSerial = serializers.SendCartItemSerializer(cart, many=True)
            cont = {
                "message": "Deleted",
                "cartItems": cartSerial.data,
            }
            return Response(cont)
        elif quantity > 0:
            cartItem.quantity = quantity
            cartItem.save()
            cart = user.cart.all()
            cartSerial = serializers.SendCartItemSerializer(cart, many=True)
            cont = {
                "message": "Updated",
                "cartItems": cartSerial.data,
            }
            return Response(cont)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart(requset):
    if requset.method == "GET":
        user = models.Customer.objects.get(user=requset.user)
        cart = user.cart.all()
        serializer = serializers.SendCartItemSerializer(cart, many=True)
        return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def order(request):
    if request.method == "POST" and request.data['type'] == "single-product":
        try:
            user = models.Customer.objects.get(username=request.user.username)
            product = models.Product.objects.get(id=request.data["product"])
            size = models.Size.objects.get(id=request.data["size"])
            qty = int(request.data["quantity"])

            if qty <= 0:
                return Response(
                    {"error": "Quantity must be greater than zero"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            cartitem, created = models.CartItem.objects.get_or_create(
                user=user,
                product=product,
                size=size,
            )

            makeorder, created = models.Order.objects.get_or_create(
                customer=user,
                status="pending",
                tracking_number="123",
                carrier="naane dhan"
            )

            if created:
                cartitem.quantity = qty
                cartitem.save()
            else:
                if qty>cartitem.quantity:
                    cartitem.quantity = qty
                    cartitem.save()

            makeorder.products.add(cartitem)
            makeorder.save()

            return Response(
                {"message": "Order placed successfully", "order_id": makeorder.id},
                status=status.HTTP_201_CREATED,
            )

        except models.Customer.DoesNotExist: return Response({"error": "Customer not found"},status=status.HTTP_404_NOT_FOUND,)
        except models.Product.DoesNotExist:  return Response({"error": "Product not found"},status=status.HTTP_404_NOT_FOUND,)
        except models.Size.DoesNotExist:     return Response({"error": "Size not found"},status=status.HTTP_404_NOT_FOUND,)
        except Exception as e:               return Response({"error": str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR,)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def isWholeSaleUser(request):
    if request.method == "GET":
        user = models.Customer.objects.get(user=request.user)
        return Response({"is_wholeSaleUser": user.is_wholeSaleUser})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getWholeSaleProducts(request):
    if request.method == "GET":
        products = models.BulkProducts.objects.all()
        serializer = serializers.BulkProductSerializer(products, many=True)
        return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def Home(request):
    cont = {}
    cont["login"] = request.user.username if request.user.is_authenticated else None

    # Categories data
    categories = models.Category.objects.all()
    serializer = serializers.CategorySerializer(categories, many=True)
    cont["categories"] = serializer.data

    def get_random_products(queryset, num_items):
        queryset_list = list(queryset)
        random.shuffle(queryset_list)
        return queryset_list[:num_items]

    # Get products for each category
    newly_added_products = get_random_products(
        models.Product.objects.order_by("-created_at")[:6], 3
    )
    popular_products = get_random_products(
        models.Product.objects.order_by("buy_count")[:6], 3
    )
    featured_products = get_random_products(
        models.Product.objects.order_by("-selling_price")[:6], 3
    )
    newly_added_productss = get_random_products(
        models.Product.objects.order_by("-created_at")[:6], 6
    )

    # Helper function to format product data
    def format_product(product, category_type):
        images = models.ProductImages.objects.filter(product=product)
        # Calculate discount badge if applicable
        discount_percentage = (
            1 - (float(product.selling_price) / float(product.market_price))
        ) * 100
        badge = (
            "Hot"
            if product.buy_count > 100
            else f"-{int(discount_percentage)}%" if discount_percentage > 0 else None
        )
        return {
            "id": product.pk,
            "slug": product.slug,
            "img1": str(images[0].image.url) if len(images) > 0 else None,
            "img2": str(images[1].image.url) if len(images) > 1 else None,
            "rating": random.randint(
                1, 5
            ),  # Assigning a random rating for demonstration
            "oldPrice": product.market_price,
            "newPrice": product.selling_price,
            "badge": badge,
            "category": (
                product.categories[0].name if product.categories else "Uncategorized"
            ),
            "name": product.name,
            "type": category_type,
        }

    # Serialize each category separately
    cont["newly_added"] = [
        format_product(p, "Newly Added") for p in newly_added_productss
    ]
    cont["hot_release"] = [
        format_product(p, "Newly Added") for p in newly_added_products
    ]
    cont["trendy"] = [format_product(p, "Popular") for p in popular_products]
    cont["best_deal"] = [format_product(p, "Featured") for p in featured_products]

    # Combine all products with their respective types
    cont["products"] = (
        [format_product(p, "Newly Added") for p in newly_added_products]
        + [format_product(p, "Popular") for p in popular_products]
        + [format_product(p, "Featured") for p in featured_products]
    )

    return Response(cont)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def Review(req):
    if req.method == "POST":
        ic(req.data)
        serializer = serializers.PostReviewSerial(data=req.data)
        if serializer.is_valid():
            review_data = {
                "user": models.Customer.objects.get(username=req.user.username),
                "product": models.Product.objects.get(slug=req.data["product"]),
                "rating": str(req.data["rating"]).strip(),
                "review": req.data["review"],
            }
            review = models.Review.objects.create(**review_data)
            review.save()
            return Response({"message": "Success"})
        return Response(serializer.errors)


@api_view(["GET"])
@permission_classes([AllowAny])
def GetReview(req, pid):
    if req.method == "GET":
        cont = {}
        reviews = models.Review.objects.filter(product=pid)
        cont["reviews"] = serializers.PutReviewSerial(reviews, many=True).data
        return Response(cont)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def AddToCart(req):
    if req.method == "POST":
        ic(req.data)
        try:
            product = models.Product.objects.get(pk=req.data["product"])
            user = models.Customer.objects.get(username=req.user.username)
            qty = int(req.data["quantity"])
            size = models.Size.objects.get(pk=req.data["size"])

            if qty <= 0:
                return Response(
                    {"error": "Quantity must be greater than zero"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            cartItem, created = models.CartItem.objects.get_or_create(
                user=user, product=product, size=size
            )

            if created:
                if qty > 20:
                    return Response(
                        {"error": "Quantity cannot exceed 20"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                cartItem.quantity = qty
                cartItem.color = product.product_color
                cartItem.save()
            else:
                if cartItem.quantity + qty > 20:
                    return Response(
                        {"error": "Total quantity cannot exceed 20"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                cartItem.quantity += qty
                cartItem.save()

            return Response(
                {"message": "Item added to cart successfully"},
                status=status.HTTP_200_OK,
            )

        except models.Product.DoesNotExist:
            return Response(
                {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except models.Size.DoesNotExist:
            return Response(
                {"error": "Size not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def Cart(req):
    user = models.Customer.objects.get(username=req.user.username)
    if req.method == "GET":
        cont = {}
        cartitem = models.CartItem.objects.filter(user=user)
        cont["cart"] = serializers.SendCartItemSerializer(cartitem, many=True).data
        return Response(cont)

    if req.method == "POST":
        cont = {}
        cart = models.CartItem.objects.get(pk=req.data["cartID"])
        if req.data["action"] == "r":
            cont["message"] = "One Item Reduced"
            if cart.quantity == 1:
                cont["message"] = "Item Deleted"
                cart.delete()
            cart.quantity -= 1
            cart.save()
        elif req.data["action"] == "a":
            cont["message"] = "One Item Added"
            cart.quantity += 1
            cart.save()
        elif req.data["action"] == "d":
            cont["message"] = "Item Deleted"
            cart.delete()
        cont["cart"] = serializers.SendCartItemSerializer(models.CartItem.objects.filter(user=user),many=True,).data
        return Response(cont)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def Order(req):
    if req.method == "POST":
        product = models.Product.objects.get(pk=req.data["product"])
        user = models.Customer.objects.get(user=req.user)
        qty = int(req.data["quantity"])
        size = models.Size.objects.get(pk=req.data["size"])

        cartItem, created = models.CartItem.objects.get_or_create(
            customer=user, product=product, size=size
        )
        if created:
            cartItem.quantity = qty
            cartItem.color = product.product_color
            cartItem.save()
            user.cart.add(cartItem)
            user.save()


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def profile(request):
    ic(request.data)
    if request.method == "GET":
        user = models.Customer.objects.get(username=request.user.username)
        piserializer = serializers.ProfileInfoSerial(user)
        shippingAddresses = models.ShippingAddress.objects.filter(user=user)
        saserial = serializers.ShippingAddressSerializer(shippingAddresses,many=True)
        cont = {
            "ProfileInfo":piserializer.data,
            "ShippingAddresses":saserial.data,
        }
        return Response(cont)

    if request.method == "PUT" and request.data["type"] == "profileinfo":
        user = models.Customer.objects.get(username=request.user.username)
        serializer = serializers.ProfileInfoSerial(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile Updated Successfully"})
        return Response(serializer.errors)
    
    if request.method == "PUT" and request.data["type"] == "addressUpdate":
        try:
            address_id = request.data.get("id")
            user = models.Customer.objects.get(username=request.user.username)
            address = models.ShippingAddress.objects.get(user=user, id=address_id)
            ic(address)
            serial = serializers.ShippingAddressSerializer(address, data=request.data)
            if serial.is_valid():
                ic("saved")
                serial.save()
                return Response({"message": "Updated Successfully"}, status=status.HTTP_200_OK)
            return Response(serial.errors,status=status.HTTP_400_BAD_REQUEST)
        except models.ShippingAddress.DoesNotExist: 
            return Response({"error": "Address not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            ic(f"Error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    if request.method == "POST" and request.data["type"] == "addressUpdate":
        try:
            user = models.Customer.objects.get(username=request.user.username)
            request.data["user"] = user.id
            serial = serializers.ShippingAddressSerializer(data=request.data)
            if serial.is_valid():
                ic("saved")
                serial.save(user=user)
                return Response({"message": "Created Successfully"},status=status.HTTP_201_CREATED)
            return Response(serial.errors,status=status.HTTP_400_BAD_REQUEST)
        except models.ShippingAddress.DoesNotExist: 
            return Response({"error": "Address not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            ic(f"Error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    if request.method == "DELETE":
        address_id = request.data.get("id")
        try:
            address = models.ShippingAddress.objects.get(id=address_id, user=request.user)
            address.delete()
            return Response({"message": "Address Deleted Successfully"})
        except models.ShippingAddress.DoesNotExist:
            return Response({"error": "Address not found"}, status=status.HTTP_404_NOT_FOUND)


from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
import razorpay
from django.conf import settings
import json

@csrf_exempt
def verify_payment(request):
    if request.method == "POST":
        try:
            razorpay_payment_id = request.data.get("razorpay_payment_id")
            razorpay_order_id = request.data.get("razorpay_order_id")
            razorpay_signature = request.data.get("razorpay_signature")

            # Initialize Razorpay client with your secret key
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_SECRET_KEY))

            # Verify the payment signature
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }

            client.utility.verify_payment_signature(params_dict)

            # If the signature is verified, handle payment success logic here
            return JsonResponse({"success": True, "message": "Payment verified successfully"})

        except razorpay.errors.SignatureVerificationError:
            return JsonResponse({"success": False, "message": "Payment verification failed"}, status=400)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=400)

    # return JsonResponse({"success": False, "message": "Invalid request method"}, status=400)

@permission_classes([IsAuthenticated])
@csrf_exempt
def create_razorpay_order(request):
    if request.method == "POST":
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        try:
            data = json.loads(request.body)
            amount = data.get("amount")
            if not amount or not isinstance(amount, (int, float)):
                return JsonResponse({"error": "Valid amount is required"}, status=400)

            amount_in_paise = int(amount * 100)
            order = client.order.create({
                "amount": amount_in_paise,
                "currency": "INR",
                "payment_capture": "1",
            })
            
            ic(order)
            return JsonResponse({
                "order_id": order["id"],
                "key": settings.RAZORPAY_KEY_ID,
                "amount": order["amount"],
                "currency": order["currency"],
            })
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid method"}, status=405)