import random
from . import models, serializers, filters
from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .needs import send_email, validate_gst


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    if request.method == "POST":
        serializer = serializers.UserSerializer(data=request.data)
        if request.data["email"]:
            pass
        else:
            return Response({"email": "Please Provide your Mail Address"})
        if serializer.is_valid():
            if User.objects.filter(email=request.data["email"]).exists():
                return Response({"message": "Email Already Exists"})
            if models.Address.objects.filter(phone=request.data['phone']).exists():
                return Response({"message": "Phone Number Already Exists"})
            user = serializer.save()
            group = Group.objects.get(name="Customer")
            user.groups.add(group)
            customer = models.Customer(user=user)
            address = models.Address(user=customer, phone=request.data["phone"])
            customer.save()
            address.save()
            cont = serializer.data
            cont["token"] = Token.objects.get(user=user).key
            cont["groups"] = [group.name]
            cont["message"] = "User Created Successfully"
            return Response(cont)
        return Response(serializer.errors)


# class CustomAuthToken(ObtainAuthToken):
#     permission_classes = [AllowAny]

#     def post(self, request, *args, **kwargs):
#         serializer = self.serializer_class(
#             data=request.data, context={"request": request}
#         )
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data["user"]
#         token, created = Token.objects.get_or_create(user=user)
#         return Response({"token": token.key, "user_id": user.pk, "email": user.email})


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
                {"token": token.key, "user_id": user.pk, "email": user.email},
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
    return Response({"message": "Authenticated"})


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

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.query_params.get("search", None)
        if query:
            queryset = queryset.filter(name__icontains=query)
        return queryset


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
def getProduct(request, pid):
    product = models.Product.objects.get(id=pid)
    product_serial = serializers.ProductSerializer(product)
    product_variant = models.ProductVariant.objects.filter(product=product)
    variant_exists = models.ProductVariant.objects.filter(product=product).exists()
    if not variant_exists:
        cont = {"variant": False, "product": product_serial.data}
        return Response(cont)

    variant_serial = serializers.ProductVariantSerializer(product_variant, many=True)
    cont = {"variant": True, "variants": variant_serial.data}
    return Response(cont)


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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def singleOrder(request):
    if request.method == "POST":
        user = models.Customer.objects.get(user=request.user)
        if not user.address.is_val:
            return Response({"message": "Invalid"})
        ois = serializers.OrderItemSerializer(data=request.data)
        if ois.is_valid():
            ois.save()
            user = models.Customer.objects.get(user=request.user)
            order = models.Order.objects.create(customer=user)
            order.products.add(ois.instance)
            order.save()
            send_email(
                to_email=user.user.email,
                subject="Order Placed",
                username=user.user.username,
                product_name=ois.instance.product.name,
                quantity=ois.instance.quantity,
                price=ois.instance.product.sellingPrice,
                total=ois.instance.quantity * ois.instance.product.sellingPrice,
                address=f"{user.address.doorNo}, {user.address.street}, {user.address.city}, {user.address.state}, {user.address.country}, {user.address.pincode}",
                phone=user.address.phone,
                landmark=user.address.landmark,
                order_date=order.date,
            )
            return Response({"message": "Success"})
        return Response(ois.errors)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart(requset):
    if requset.method == "GET":
        user = models.Customer.objects.get(user=requset.user)
        cart = user.cart.all()
        serializer = serializers.SendCartItemSerializer(cart, many=True)
        return Response(serializer.data)


@api_view(["GET", "POST", "PUT"])
@permission_classes([IsAuthenticated])
def profile(request):
    if request.method == "GET":
        user = models.Customer.objects.get(user=request.user)
        address = models.Address.objects.get(user=user)
        cont = {
            "message": "Success",
            "city": address.city,
            "state": address.state,
            "email": user.user.email,
            "doorNo": address.doorNo, 
            "street": address.street,
            "phone": address.getPhone,
            "pincode": address.pincode,
            "country": address.country,
            "profilePic": user.pic.url,
            "landmark": address.landmark,
            "username": user.user.username,
            "lastname": user.user.last_name,
            "firstname": user.user.first_name,
            "gstNo": user.gstNo,
        }
        return Response(cont)

    if request.method == "POST":
        user = models.Customer.objects.get(user=request.user)
        address = models.Address.objects.get(user=user)
        user.user.first_name = request.data["firstname"]
        user.user.last_name = request.data["lastname"]
        if "profilePic" in request.data:
            user.pic = request.data["profilePic"]
        address.city = request.data["city"]
        address.state = request.data["state"]
        address.doorNo = request.data["doorNo"]
        address.street = request.data["street"]
        address.pincode = request.data["pincode"]
        address.country = request.data["country"]
        if "landmark" in request.data:
            address.landmark = request.data["landmark"]
        user.save()
        address.save()
        user.user.save()
        

        if (
            models.User.objects.filter(email=request.data["email"])
            .exclude(pk=user.user.pk)
            .exists()
        ):
            return Response({"message": "Email Already Exists"})
        if (
            models.User.objects.filter(username=request.data["username"])
            .exclude(pk=user.user.pk)
            .exists()
        ):
            return Response({"message": "Username Already Exists"})
        if (
            models.Address.objects.filter(phone=request.data["phone"])
            .exclude(pk=address.pk)
            .exists()
        ):
            return Response({"message": "Phone Number Already Exists"})
        try:
            if request.data["gstNo"] and validate_gst(request.data["gstNo"]):
                if (
                    request.data["gstNo"]
                    and models.Customer.objects.filter(gstNo=request.data["gstNo"])
                    .exclude(pk=user.pk)
                    .exists()
                ):
                    return Response({"message": "GST Number Already Exists"})
                elif request.data["gstNo"]:
                    user.gstNo = request.data["gstNo"]
                    user.save()
            else:
                return Response({"message": "Invalid GST Number"})
        except:
            pass
        
        address.phone = request.data["phone"]
        user.user.email = request.data["email"]
        user.user.username = request.data["username"]
        user.save()
        address.save()
        user.user.save()
        if not address.is_val:
            return Response({"message": "Invalid"})
        return Response({"message": "Success"}) 
    
    if request.method == "PUT":
        try:
            user = models.Customer.objects.get(user=request.user)
            user.user.first_name = request.data["firstname"]
            user.user.last_name = request.data["lastname"]
            address = models.Address.objects.get(user=user)
            address.doorNo = request.data["doorNo"]
            address.street = request.data["street"]
            address.city = request.data["city"]
            address.state = request.data["state"]
            address.pincode = request.data["pincode"]
            address.country = request.data["country"]
            if "landmark" in request.data:
                address.landmark = request.data["landmark"]
            if "profilePic" in request.data:
                user.pic = request.data["profilePic"]
            user.save()
            user.user.save()
            address.save()
            return Response({"message": "Success"})
        except:
            return Response({"message": "Failed"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getOrder(request):
    user = models.Customer.objects.get(user=request.user)
    order = models.Order.objects.filter(customer=user)
    serializer = serializers.OrderSerializer(order, many=True)
    return Response(serializer.data)


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
    newly_added_products = get_random_products(models.Product.objects.order_by('-created_at')[:6],3)
    popular_products = get_random_products(models.Product.objects.order_by('buy_count')[:6],3)
    featured_products = get_random_products(models.Product.objects.order_by('-sellingPrice')[:6],3)
    newly_added_productss = get_random_products(models.Product.objects.order_by('-created_at')[:6],6)

    # Helper function to format product data
    def format_product(product, category_type):
        images = product.images.all()
        # Calculate discount badge if applicable
        discount_percentage = (1 - (float(product.sellingPrice) / float(product.marketPrice))) * 100
        badge = (
            "Hot" if product.buy_count > 100
            else f"-{int(discount_percentage)}%" if discount_percentage > 0 else None
        )
        return {
            "img1": str(images[0].image.url) if len(images) > 0 else None,
            "img2": str(images[1].image.url) if len(images) > 1 else None,
            "rating": random.randint(1, 5),  # Assigning a random rating for demonstration
            "oldPrice": product.marketPrice,
            "newPrice": product.sellingPrice,
            "badge": badge,
            "category": product.categories[0].name if product.categories else "Uncategorized",
            "name": product.name,
            "type": category_type,
        }

    # Serialize each category separately
    cont["newly_added"] = [format_product(p, "Newly Added") for p in newly_added_productss]
    cont["hot_release"] = [format_product(p, "Newly Added") for p in newly_added_products]
    cont["trendy"] = [format_product(p, "Popular") for p in popular_products]
    cont["best_deal"] = [format_product(p, "Featured") for p in featured_products]

    # Combine all products with their respective types
    cont["products"] = (
        [format_product(p, "Newly Added") for p in newly_added_products] +
        [format_product(p, "Popular") for p in popular_products] +
        [format_product(p, "Featured") for p in featured_products]
    )

    return Response(cont)
