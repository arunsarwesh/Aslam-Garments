from rest_framework import serializers
from . import models


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Password field for writing only

    class Meta:
        model = models.User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = models.User(
            email=validated_data["email"], username=validated_data["username"]
        )
        user.set_password(validated_data["password"])
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get("email", instance.email)
        instance.username = validated_data.get("username", instance.username)
        instance.set_password(validated_data.get("password", instance.password))
        instance.save()
        return instance


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.image
        fields = ["image", "is_main"]


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


class ProductSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    colors = ColorSerializer(source="color_set", many=True, read_only=True)
    category = CategorySerializer(source="category_set", many=True, read_only=True)
    product_color = ColorSerializer(read_only=True)
    product_size = SizeSerializer(read_only=True)
    sizes = SizeSerializer(source="size_set", many=True, read_only=True)
    SKU = serializers.CharField(read_only=True)

    class Meta:
        model = models.Product
        fields = "__all__"

class ProductVariantSerializer(serializers.ModelSerializer):
    product = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = models.ProductVariant
        fields = "__all__"


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Subscription
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CartItem
        fields = ["product", "quantity", "size", "color"]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OrderItem
        fields = ["product", "quantity", "size", "color"]


class SendCartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    size = SizeSerializer()
    color = ColorSerializer()

    class Meta:
        model = models.CartItem
        fields = ["id", "product", "quantity", "size", "color"]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Address
        fields = "__all__"


class GetUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ["username", "email"]

class OIS(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = models.OrderItem
        fields = ["product", "quantity", "size", "color"]

class OrderSerializer(serializers.ModelSerializer):
    products = OIS(many=True, read_only=True)

    class Meta:
        model = models.Order
        fields = "__all__"

class BIS(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = models.BulkProductItem
        fields = "__all__"

class BulkProductSerializer(serializers.ModelSerializer):
    bulk_items = BIS(many=True, read_only=True)
    class Meta:
        model = models.BulkProducts
        fields = ["id", "name", "discription", "marketPrice", "wholeSellPrice", "bulk_items","img"]

class HomeProductSerial(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    class Meta:
        model = models.Product
        fields = ["id", "name", "sellingPrice","marketPrice", "images","rating","buy_count"]
    
class PostReviewSerial(serializers.ModelSerializer):
    class Meta:
        model = models.Review
        fields = ["product","rating","review"]