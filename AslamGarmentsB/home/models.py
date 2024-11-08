from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from phonenumber_field.modelfields import PhoneNumberField
from django.utils import timezone
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

def validate_gst(value):
    gst_pattern = r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$'
    if not re.match(gst_pattern, value):
        raise ValidationError(
            _('Invalid GST number. Please enter a valid GST number.'),
            code='invalid_gst'
        )


class location(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return f"{self.latitude}, {self.longitude}"


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    pic = models.ImageField(upload_to="profile_pic/", null=True, blank=True)
    cart = models.ManyToManyField("home.CartItem", blank=True)
    otp = models.PositiveIntegerField(null=True)
    otpst = models.DateTimeField(default=timezone.now)
    gstNo = models.CharField(max_length=200, null=True, blank=True,validators=[validate_gst],unique=True)

    def __str__(self):
        return self.user.username

    @property
    def cart_items(self):
        ci = self.cart.all()
        return " | ".join(
            [
                str(c.product.name) + " - " + str(c.color).upper() + " - " + str(c.size)
                for c in ci
            ]
        )

    @property
    def address(self):
        address = Address.objects.get(user=self.user)
        return address
    
    @property
    def getGST(self):
        return self.gstNo
    
    @property
    def is_wholeSaleUser(self):
        return True if self.gstNo else False


class Address(models.Model):
    user = models.OneToOneField(
        Customer, on_delete=models.CASCADE, null=True, blank=True
    )
    doorNo = models.CharField(max_length=200, null=True, blank=True)
    buildingName = models.CharField(max_length=200, null=True, blank=True)
    street = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    state = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    pincode = models.CharField(max_length=200, null=True, blank=True)
    landmark = models.CharField(max_length=200, null=True, blank=True)
    location = models.OneToOneField(
        location, on_delete=models.CASCADE, null=True, blank=True
    )
    phone = PhoneNumberField(blank=True)

    @property
    def getPhone(self):
        return str(self.phone)

    @property
    def is_val(self):
        if (
            self.doorNo
            and self.street
            and self.city
            and self.state
            and self.country
            and self.pincode
            and self.phone
        ):
            return True
        return False
    
    def __str__(self):
        return f"{self.doorNo}, {self.buildingName}, {self.street}, {self.city}, {self.state}, {self.country}, {self.pincode}, {self.landmark}, {self.location}"
    
    class Meta:
        verbose_name = "Address"
        verbose_name_plural = "Addresses"


class image(models.Model):
    belongs_to = models.ForeignKey("home.Product", on_delete=models.CASCADE, null=True)
    image = models.ImageField(upload_to="product_pic/", null=True, blank=True)
    is_main = models.BooleanField(default=False)


class Product(models.Model):
    name = models.CharField(max_length=200)
    discription = models.TextField(null=True, blank=True)
    stock = models.IntegerField()
    product_color = models.ForeignKey("home.Color", on_delete=models.CASCADE, null=True, blank=True)
    marketPrice = models.FloatField()
    sellingPrice = models.FloatField()
    images = models.ManyToManyField(image, blank=True)
    product_size = models.ForeignKey("home.Size", on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    buy_count = models.IntegerField(default=0)
    rating = models.FloatField(default=0, max_length=5)

    def __str__(self):
        colors = self.color_set.all().values_list("color", flat=True)
        colors_str = ", ".join(colors) if colors else "No colors"
        return f"{self.id}. {self.name} ({colors_str}) ({self.stock} in stock)"

    @property
    def mainImage(self):
        for image in self.images.all():
            if image.is_main:
                return image
        return None

    @property
    def notMainImages(self):
        images = []
        for image in self.images.all():
            if not image.is_main:
                images.append(image)
        return images

    @property
    def categories(self):
        category = Category.objects.filter(products__id=self.id)
        return category

    @property
    def colors(self):
        return ", ".join(self.color_set.all().values_list("color", flat=True))

    @property
    def sizes(self):
        return ", ".join(self.size_set.all().values_list("size", flat=True))

class BulkProductItem(models.Model):
    bulk = models.ForeignKey("home.BulkProducts", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    bulk_qty = models.IntegerField(default=1)
    
    def __str__(self):
        return self.product.name
    
class BulkProducts(models.Model):
    name = models.CharField(max_length=200)
    discription = models.TextField(null=True, blank=True)
    marketPrice = models.FloatField()
    wholeSellPrice = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    img = models.ImageField(upload_to="bulk_pic/", null=True, blank=True)
    
    def __str__(self):
        return self.name
    
    @property
    def bulk_items(self):
        return BulkProductItem.objects.filter(bulk=self)
    
class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField(default=1)
    size = models.ForeignKey("home.Size", on_delete=models.CASCADE, null=True, blank=True)
    color = models.ForeignKey("home.Color", on_delete=models.CASCADE, null=True, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)

    @property
    def get_total(self) -> float:
        total = self.product.sellingPrice * self.quantity
        return total


class ProductVariant(models.Model):
    variant = models.CharField(max_length=50, default="NA")
    product = models.ManyToManyField("home.Product", blank=True)

    def __str__(self):
        products = self.product.all()
        product_str_list = [
            f"{product.name} - {product.product_color}" for product in products
        ]
        return ", ".join(product_str_list) if product_str_list else "No Products"

    @property
    def total_products(self) -> int:
        return self.product.count()


class Order(models.Model):
    customer = models.ForeignKey(
        Customer, on_delete=models.SET_NULL, null=True, blank=True
    )
    products = models.ManyToManyField(OrderItem, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    status_opt = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("packed", "Packed"),
        ("shipped", "Shipped"),
        ("out_for_delivery", "Out for delivery"),
        ("delivered", "Delivered"),
    ]
    status = models.CharField(max_length=200, choices=status_opt, default="pending")
    pay_opt = [
        ("cod", "Cash on delivery"),
        ("online", "Online payment"),
    ]
    payment = models.CharField(max_length=200, choices=pay_opt, default="cod")

    def __str__(self):
        return str(self.id)

    @property
    def get_cart_total(self) -> float:
        total = 0
        for order_item in self.products.all():
            total += order_item.get_total
        return total

    @property
    def is_deliveried(self) -> bool:
        if self.status == "delivered":
            return True
        return False

    @property
    def total_products(self) -> int:
        oi = self.products.all().values_list("quantity")
        return str(sum([int(sum(x)) for x in oi]))


class Category(models.Model):
    name = models.CharField(max_length=200)
    products = models.ManyToManyField(Product, blank=True)
    image = models.ImageField(upload_to="category_pic/", null=True, blank=True)

    def __str__(self):
        return self.name

    @property
    def total_products(self) -> int:
        return self.products.count()

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"


class Subscription(models.Model):
    email = models.EmailField(unique=True)


class Color(models.Model):
    color = models.CharField(max_length=50)
    hexcode = models.CharField(max_length=50, null=True, blank=True)
    products = models.ManyToManyField(
        Product, blank=True, verbose_name="Products Colors"
    )

    def __str__(self):
        return self.color

    @property
    def total_products(self) -> int:
        return self.products.count()

    class Meta:
        verbose_name = "Color"
        verbose_name_plural = "Colors"


class Size(models.Model):
    size_opt = [
        ("XS", "Extra Small"),
        ("S", "Small"),
        ("M", "Medium"),
        ("L", "Large"),
        ("XL", "Extra Large"),
        ("XXL", "Extra Extra Large"),
    ]
    size = models.CharField(max_length=50, choices=size_opt, null=True, blank=True)
    products = models.ManyToManyField(Product, blank=True, verbose_name="Products Sizes")
    shoulder = models.FloatField(null=True, blank=True)
    chest = models.FloatField(null=True, blank=True)
    top_length = models.FloatField(null=True, blank=True)
    sleev_length = models.FloatField(null=True, blank=True)
    waist = models.FloatField(null=True, blank=True)
    hip = models.FloatField(null=True, blank=True)
    pant_length = models.FloatField(null=True, blank=True)
    thigh = models.FloatField(null=True, blank=True)
    

    def __str__(self):
        # return f"{self.size} => Shoulder : {self.shoulder} | Chest: {self.chest} | Top Length: {self.top_length} | Sleeve Length: {self.sleev_length} | Waist: {self.waist} | Hip: {self.hip} | Pant Length: {self.pant_length} | Thigh: {self.thigh}"
        return self.size

    @property
    def total_products(self) -> int:
        return self.products.count()

    class Meta:
        verbose_name = "Size"
        verbose_name_plural = "Sizes"


class CartItem(models.Model):
    user = models.ForeignKey(Customer, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    size = models.ForeignKey(Size, on_delete=models.CASCADE, null=True, blank=True)
    color = models.ForeignKey(Color, on_delete=models.CASCADE, null=True, blank=True)
    created = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"

    @property
    def get_price(self):
        return self.product.sellingPrice * self.quantity

    @property
    def user(self):
        return self.customer.user.username
