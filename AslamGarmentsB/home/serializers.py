from rest_framework import serializers
from . import models


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Password field for writing only
    phone = serializers.CharField(required=False)
    pic = serializers.ImageField(required=False)

    class Meta:
        model = models.Customer
        fields = ["username", "email", "password", "phone","pic"]

    def create(self, validated_data):
        user = models.Customer(email=validated_data["email"], username=validated_data["username"],phone=validated_data["phone"])
        if "pic" in validated_data:
            user.pic = validated_data["pic"]
        user.set_password(validated_data["password"])
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get("email", instance.email)
        instance.username = validated_data.get("username", instance.username)
        instance.phone = validated_data.get("phone", instance.phone)
        if "password" in validated_data:
            instance.set_password(validated_data["password"])        
        instance.save()
        return instance


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Color
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = ["id", "name", "image", "total_products"]


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Size
        fields = "__all__"


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductImages
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = CategorySerializer(source="category_set", many=True, read_only=True)
    product_color = ColorSerializer(read_only=True)
    product_size = SizeSerializer(read_only=True)
    avail_size = SizeSerializer(many=True, read_only=True)
    SKU = serializers.CharField(read_only=True)

    class Meta:
        model = models.Product
        fields = "__all__"

class ProductGroupSerial(serializers.ModelSerializer):
    product = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = models.ProductGroup
        fields = "__all__"


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Subscription
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CartItem
        fields = ["product", "quantity", "size", "color"]


class SendCartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    size = SizeSerializer()
    color = ColorSerializer()

    class Meta:
        model = models.CartItem
        fields = ["id", "product", "quantity", "size", "color"]


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ShippingAddress
        fields = "__all__"
        extra_kwargs = {
            "user": {"read_only": True}
        }


class GetUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ["username", "email"]

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields = "__all__"


class HomeProductSerial(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = ["id", "name","discription", "sellingPrice","marketPrice", "images","rating","buy_count"]
    
class PostReviewSerial(serializers.ModelSerializer):
    product = serializers.CharField()
    class Meta:
        model = models.Review
        fields = ["product","rating","review"]

class ReviewUserSerial(serializers.ModelSerializer):
    class Meta:
        model = models.Customer
        fields = ["pic","username"]

class PutReviewSerial(serializers.ModelSerializer):
    user = ReviewUserSerial()
    class Meta:
        model = models.Review
        fields = ["rating","review","user","created_at"]

class GetCartSerial(serializers.ModelSerializer):
    product = HomeProductSerial()
    size = SizeSerializer()
    class Meta:
        model = models.CartItem
        fields  = ["id",'product','quantity','size','color']

class ProfileInfoSerial(serializers.ModelSerializer):
    class Meta:
        model = models.Customer
        fields = ["username","first_name","last_name","email","phone","gender","pic"]
        extra_kwargs = {
            "pic": {"read_only": True}
        }
        
    def validate_email(self, value):
        user_id = self.instance.id if self.instance else None
        if models.Customer.objects.filter(email=value).exclude(id=user_id).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value
        
        