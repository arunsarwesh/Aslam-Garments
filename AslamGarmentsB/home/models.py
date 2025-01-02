from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from phonenumber_field.modelfields import PhoneNumberField
from django.utils import timezone
from django.urls import reverse
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re


def validate_gst(value):
    gst_pattern = r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$"
    if not re.match(gst_pattern, value):
        raise ValidationError(
            _("Invalid GST number. Please enter a valid GST number."),
            code="invalid_gst",
        )
        
        
class Location(models.Model):
    latitude = models.CharField(max_length=200)
    longitude = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.latitude}, {self.longitude}"


class Customer(User):
    pic = models.ImageField(upload_to="profile_pic/", null=True, blank=True)
    gstNo = models.CharField(max_length=200, null=True, blank=True, validators=[validate_gst], unique=True)
    phone = PhoneNumberField()
    gender_option = [
            ("Male","male"),
            ("Female","female"),
        ]
    gender = models.CharField(max_length=50, choices=gender_option, null=True, blank=True)

    def __str__(self):
        return self.username
    
    @property
    def getShippingAddress(self):
        return self.shippingaddress_set.all()

    @property
    def getGST(self):
        return self.gstNo

    @property
    def is_wholeSaleUser(self):
        return bool(self.gstNo)



class ShippingAddress(models.Model):
    user = models.ForeignKey(Customer, on_delete=models.CASCADE,help_text="User who is going to receive the product")
    name = models.CharField(max_length=200)
    phone = PhoneNumberField()
    pincode = models.CharField(max_length=200)
    locality = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length=200)
    state = models.CharField(max_length=200)
    landmark = models.CharField(max_length=200, null=True, blank=True)
    alternate_phone = PhoneNumberField(null=True, blank=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} - {self.phone} - {self.city} - {self.state}"
    
    class Meta:
        verbose_name = "Shipping Address"
        verbose_name_plural = "Shipping Addresses"
        


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    stock = models.PositiveIntegerField()  # Ensure stock can't be negative
    product_color = models.ForeignKey("home.Color", on_delete=models.CASCADE, null=True, blank=True)
    product_size = models.ForeignKey("home.Size", on_delete=models.CASCADE, null=True, blank=True)
    avail_size = models.ManyToManyField("home.Size", blank=True, related_name="products_sizes")
    market_price = models.FloatField()
    selling_price = models.FloatField()

    # Additional data
    rating = models.FloatField(default=0)
    buy_count = models.PositiveIntegerField(default=0)
    tags = ArrayField(
        models.CharField(max_length=200), blank=True, null=True, default=list
    )
    fabric = ArrayField(
        models.CharField(max_length=200),
        blank=True,
        null=True,
        default=list,
        help_text="Material of the product, e.g., 'cotton, silk, wool'",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # Track updates
    gsm = models.FloatField(null=True, blank=True, help_text="Thickness of the material")
    product_type = models.CharField(max_length=50, blank=True, null=True)
    sleeve = models.CharField(max_length=50, blank=True, null=True)
    fit = models.CharField(max_length=50, blank=True, null=True)
    ideal_for = models.CharField(max_length=50, blank=True, null=True)
    net_weight = models.FloatField(null=True, blank=True, help_text="Net weight in grams")

    slug = models.SlugField(
        max_length=255, unique=True, blank=True
    )  # Optional slug for SEO-friendly URLs

    def __str__(self):
        return f"{self.name} ({self.stock} in stock)"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
        
    def get_absolute_url(self):
        return reverse("product_detail", kwargs={"slug": self.slug})

    @property
    def SKU(self):
        """
        Generate a unique SKU for the product using various attributes.
        """
        fabric_initials = (
            "".join([f[0].upper() for f in self.fabric]) if self.fabric else ""
        )
        return (
            f"{self.id}"
            f"{self.product_size.size[:1].upper() if self.product_size else 'S'}"
            f"{self.product_color.color[:1].upper() if self.product_color else 'C'}"
            f"{self.stock:03d}"  # Pad stock to 3 digits
            f"{int(self.gsm or 0):04d}"  # Pad GSM to 4 digits
            f"{fabric_initials}"
            f"{self.product_type[:1].upper() if self.product_type else 'T'}"
            f"{self.sleeve[:1].upper() if self.sleeve else 'L'}"
            f"{self.fit[:1].upper() if self.fit else 'F'}"
            f"{int(self.net_weight or 0):04d}"  # Pad weight to 4 digits
            f"{self.ideal_for[:1].upper() if self.ideal_for else 'I'}"
        )

    @property
    def categories(self):
        return Category.objects.filter(products=self)
    
    @property
    def images(self):
        return ProductImages.objects.filter(product=self)

    class Meta:
        ordering = ["-created_at"]  # Newest products first
        verbose_name = "Product"
        verbose_name_plural = "Products"

class ProductImages(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="product_images")
    image = models.ImageField(upload_to="product_images/")

    def __str__(self):
        return self.product.name

    class Meta:
        verbose_name = "Product Image"
        verbose_name_plural = "Product Images"
    
    @property # delete the record if the product is null/empty
    def delete_if_empty(self):
        if not self.product: 
            self.delete()

class ProductGroup(models.Model):
    group_name = models.CharField(max_length=50, default="NA")
    product = models.ManyToManyField("home.Product", blank=True)
    
    def __str__(self):
        return self.group_name
    
    class Meta:
        verbose_name = "Product Group"
        verbose_name_plural = "Product Groups"

        

class Category(models.Model):
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to="category_pic/")
    products = models.ManyToManyField(Product, blank=True)

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
    hexcode = models.CharField(max_length=50)
    products = models.ManyToManyField(Product, blank=True, verbose_name="Products Colors")

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
        ("XXL", "Extra Extra Large")
    ]
    size = models.CharField(max_length=50, choices=size_opt)
    products = models.ManyToManyField(Product, blank=True, verbose_name="Products Sizes",related_name="size_set")
    # Upper body measurements
    bust = models.FloatField(null=True, blank=True)  # Bust circumference (for women)
    chest = models.FloatField(null=True, blank=True)  # Chest circumference
    shoulder = models.FloatField(null=True, blank=True)  # Shoulder width
    top_length = models.FloatField(null=True, blank=True)  # Length of top
    sleeve_length = models.FloatField(null=True, blank=True)  # Length of sleeves
    cuff_circumference = models.FloatField(null=True, blank=True)  # Sleeve cuff circumference
    bicep_circumference = models.FloatField(null=True, blank=True)  # Bicep circumference
    # Lower body measurements
    hip = models.FloatField(null=True, blank=True)  # Hip circumference
    rise = models.FloatField(null=True, blank=True)  # Distance from waist to crotch
    waist = models.FloatField(null=True, blank=True)  # Waist circumference
    thigh = models.FloatField(null=True, blank=True)  # Thigh circumference
    pant_length = models.FloatField(null=True, blank=True)  # Full length of pants
    inseam_length = models.FloatField(null=True, blank=True)  # Inner leg length
    knee_circumference = models.FloatField(null=True, blank=True)  # Knee circumference
    ankle_circumference = models.FloatField(null=True, blank=True)  # Ankle circumference
    # Dresses/Full body measurements
    dress_length = models.FloatField(null=True, blank=True)  # Full length of the dress
    shoulder_to_hip = models.FloatField(null=True, blank=True)  # Length from shoulder to hip
    shoulder_to_knee = models.FloatField(null=True, blank=True)  # Length from shoulder to knee
    shoulder_to_waist = models.FloatField(null=True, blank=True)  # Length from shoulder to waist
    shoulder_to_ankle = models.FloatField(null=True, blank=True)  # Length from shoulder to ankle
    neck_circumference = models.FloatField(null=True, blank=True)  # Neck circumference

    def __str__(self):
        return f"{self.get_size_display()}"

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
    size = models.ForeignKey(Size, on_delete=models.CASCADE)
    created = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self):
        return f"{self.product.name} (x{self.quantity})"

    @property
    def price(self):
        return self.product.selling_price * self.quantity
    
    @property
    def is_ordered(self):
        return Order.objects.filter(products = self).exists()



class Review(models.Model):
    user = models.ForeignKey(Customer, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    rating = models.FloatField()
    review = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.rating} stars by {self.user.username}"



class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL,null=True,blank=True)
    shipping_address = models.ForeignKey(ShippingAddress, on_delete=models.SET_NULL,null=True,blank=True)
    products = models.ManyToManyField(CartItem, blank=True)
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("packed", "Packed"),
        ("shipped", "Shipped"),
        ("out_for_delivery", "Out for delivery"),
        ("delivered", "Delivered"),
    ]
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="pending")
    PAYMENT_CHOICES = [("cod", "Cash on delivery"), ("online", "Online payment")]
    payment = models.CharField(max_length=200, choices=PAYMENT_CHOICES, default="cod")
    tracking_number = models.CharField(max_length=200, blank=True, null=True)
    carrier = models.CharField(max_length=200, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id}"

    @property
    def cart_total(self):
        return sum(item.price for item in self.products.all())

    @property
    def is_delivered(self):
        return self.status == "delivered"

    @property
    def total_products(self):
        return self.products.aggregate(models.Sum("quantity"))["quantity__sum"] or 0