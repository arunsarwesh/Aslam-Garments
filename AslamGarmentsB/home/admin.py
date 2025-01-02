import os
from django import forms
from django.contrib import admin
from django.utils.html import mark_safe,format_html
from . import models
from django.core.mail import send_mail
from django.utils import timezone
from django.utils.text import slugify
from django.conf import settings
from django.db.models import Count
from rest_framework.authtoken.admin import TokenAdmin
from django.contrib.auth.admin import UserAdmin
from django.contrib.admin import SimpleListFilter
from django.utils.translation import gettext_lazy as _
import csv
from django.http import HttpResponse
import base64
from django.urls import reverse
from matplotlib.figure import Figure
import io


TokenAdmin.raw_id_fields = ["user"]
admin.site.site_header = "AG Admin"
admin.site.site_title = "Admin site"
admin.site.index_title = "AG Admin"






class ProductAdminForm(forms.ModelForm):
    """
    Custom form for the Product admin.
    """
    tags = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            "placeholder": "Enter tags separated by commas"
        }),
        help_text="Tags should be separated by commas, e.g., 'tag1, tag2'."
    )
    fabric = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            "placeholder": "Enter fabrics separated by commas"
        }),
        help_text="Fabrics should be separated by commas, e.g., 'cotton, silk'."
    )

    class Meta:
        model = models.Product
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            self.initial["tags"] = ", ".join(self.instance.tags or [])
            self.initial["fabric"] = ", ".join(self.instance.fabric or [])

    def clean_tags(self):
        """
        Convert the comma-separated string of tags into a list.
        """
        tags = self.cleaned_data.get("tags", "")
        return [tag.strip() for tag in tags.split(",") if tag.strip()]

    def clean_fabric(self):
        """
        Convert the comma-separated string of fabric types into a list.
        """
        fabric = self.cleaned_data.get("fabric", "")
        return [item.strip() for item in fabric.split(",") if item.strip()]

class ProductCategoriesInline(admin.TabularInline):
    """
    Inline configuration for managing product categories.
    """
    model = models.Category.products.through  # Use the through table for many-to-many relations
    extra = 1
    verbose_name = "Category"
    verbose_name_plural = "Categories"

    def category_name(self, obj):
        """
        Display the name of the category.
        """
        return obj.category.name if obj.category else "No Category"

    category_name.short_description = "Category Name"

class ProductImagesInline(admin.TabularInline):
    """
    Inline configuration for managing multiple product images.
    """
    model = models.ProductImages
    extra = 1
    fields = ("image", "preview")
    readonly_fields = ("preview",)

    def preview(self, obj):
        """
        Generate a preview thumbnail for the image.
        """
        if obj.image:
            return format_html('<img src="{}" style="width: 75px; height: auto;" />', obj.image.url)
        return "No image available"

    preview.short_description = "Preview"

@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Product model.
    """
    form = ProductAdminForm
    inlines = [ProductImagesInline,ProductCategoriesInline]
    list_display = ("main_image_tag","name", "stock", "market_price", "selling_price", "rating", "buy_count", "product_size", "product_color", "product_type", "created_at")
    list_filter = ("product_type", "product_color", "rating", "created_at", "stock")
    search_fields = ("name", "tags", "fabric")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at", "main_image_tag")

    fieldsets = (
        ("General Information", {
            "fields": ("name", "description", "slug", "tags", "fabric")
        }),
        ("Pricing and Stock", {
            "fields": ("market_price", "selling_price", "stock", "buy_count")
        }),
        ("Product Attributes", {
            "fields": ("product_color", "product_size", "avail_size", "gsm", "product_type", "sleeve", "fit", "ideal_for", "net_weight")
        }),
        
    )

    def main_image_tag(self, obj):
        """
        Display the first image associated with the product as a thumbnail.
        """
        first_image = obj.product_images.first()  # Retrieve the first related image
        if first_image and first_image.image:
            return format_html('<img src="{}" width="100" height="100" style="object-fit: cover;" />', first_image.image.url)
        return "No Image"

    main_image_tag.short_description = "Main Image"


    def save_model(self, request, obj, form, change):
        """
        Save the Product model first, then update its images from ProductImages.
        """
        # Save the product instance first
        obj.tags = form.cleaned_data.get("tags", [])
        obj.fabric = form.cleaned_data.get("fabric", [])
        if not obj.slug:
            obj.slug = slugify(obj.name)
        super().save_model(request, obj, form, change)



@admin.register(models.ProductImages)
class ProductImagesAdmin(admin.ModelAdmin):
    """
    Admin configuration for the ProductImages model.
    """
    list_display = ("product", "image_tag")
    list_filter = ("product",)
    search_fields = ("product__name",)
    ordering = ("product",)

    def image_tag(self, obj):
        """
        Display the image as a thumbnail in the admin list view.
        """
        return mark_safe(f'<img src="{obj.image.url}" width="100" height="100" style="object-fit: cover;" />')

    image_tag.short_description = "Image Preview"
    
    def save_model(self, request, obj, form, change):
        """
        Save the ProductImages model and update the associated Product's images field.
        """
        super().save_model(request, obj, form, change)
        # Update the associated Product's images field
        obj.product.images.append(obj.image.url)
        obj.product.save()
        
    def delete_model(self, request, obj):
        """
        Delete the ProductImages model and update the associated Product's images field.
        """
        product = obj.product
        super().delete_model(request, obj)
        # Update the associated Product's images field
        product.images.remove(obj.image.url)
        product.save()
        
    def delete_queryset(self, request, queryset):
        """
        Delete a queryset of ProductImages and update the associated Product's images field.
        """
        products = set(queryset.values_list("product", flat=True))
        super().delete_queryset(request, queryset)
        for product in products:
            product.images = list(models.ProductImages.objects.filter(product=product).values_list("image", flat=True))
            product.save()
            
    def delete_selected(self, request, queryset):
        """
        Delete selected ProductImages and update the associated Product's images field.
        """
        products = set(queryset.values_list("product", flat=True))
        super().delete_selected(request, queryset)
        for product in products:
            product.images = list(models.ProductImages.objects.filter(product=product).values_list("image", flat=True))
            product.save()
            
    delete_selected.short_description = "Delete selected Product Images"
    
    def get_fields(self, request, obj=None):
        """
        Customize the fields displayed in the admin form.
        """
        fields = super().get_fields(request, obj)
        if obj:
            return fields + ["product"]
        return fields
    
    def get_readonly_fields(self, request, obj=None):
        """
        Make the product field read-only when editing an existing ProductImages instance.
        """
        if obj:
            return ["product"]
        return []
    
    def get_form(self, request, obj=None, **kwargs):
        """
        Customize the form widget for the image field.
        """
        form = super().get_form(request, obj, **kwargs)
        form.base_fields["image"].widget = forms.FileInput()
        return form



@admin.register(models.ProductGroup)
class ProductGroupAdmin(admin.ModelAdmin):
    list_display = ["group_name", "display_products", "total_products", "product_images", "id"]
    list_filter = ["group_name", "product"]
    search_fields = ["group_name", "product__name"]

    def display_products(self, obj):
        products = obj.product.all()
        return " | ".join(
            [
                f"{product.name} - {str(product.product_color).capitalize()} (₹{product.selling_price})"
                for product in products
            ]
        ) if products else "No Products"
    display_products.short_description = "Products"

    def total_products(self, obj):
        return obj.product.count()
    total_products.short_description = "Total Products"

    def product_images(self, obj):
        products = obj.product.all()
        images = [
            format_html(f'<img src="{image.image.url}" alt="{product.name}" style="width: 50px; height: 50px;" />',)
            for product in products
            for image in product.product_images.all()  # Assuming a related name `product_images`
        ]
        return format_html(" ".join(images)) if images else "No Images"
    product_images.short_description = "Product Images"

    class ProductInline(admin.TabularInline):
        model = models.ProductGroup.product.through
        fields = ["product"]
        extra = 1
        verbose_name = "Product"
        verbose_name_plural = "Products in Group"

    inlines = [ProductInline]

    def associate_products_to_group(self, request, queryset):
        self.message_user(request, "Products successfully associated with the selected groups.")
    associate_products_to_group.short_description = "Associate Products to Group"

    actions = ["associate_products_to_group"]

    fieldsets = (
        (None, {
            "fields": ["group_name"],
        }),
    )
    


@admin.register(models.Customer)
class CustomerAdmin(UserAdmin):
    """
    Admin class for the Customer model.
    Inherits from UserAdmin to handle default User fields like username and email.
    """
    model = models.Customer
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "gstNo",
        "is_wholeSaleUser",
        "profile_pic_preview",
    )
    list_filter = ("is_staff", "is_superuser", "is_active", "date_joined")
    search_fields = ("username", "email", "gstNo", "first_name", "last_name")
    ordering = ("-date_joined",)
    readonly_fields = ("date_joined", "last_login", "profile_pic_preview")

    fieldsets = (
        ("Personal Information", {
            "fields": ("username", "email", "first_name", "last_name","gender", "pic", "profile_pic_preview", "gstNo")
        }),
        ("Permissions", {
            "fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions"),
        }),
        ("Important Dates", {
            "fields": ("last_login", "date_joined"),
        }),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "password1", "password2", "pic", "gstNo"),
        }),
    )

    def profile_pic_preview(self, obj):
        """
        Display a small preview of the profile picture in the admin panel.
        """
        if obj.pic:
            return mark_safe(f'<img src="{obj.pic.url}" width="50" height="50" style="object-fit:cover;border-radius:50%;"/>')
        return "No Profile Picture"
    
    profile_pic_preview.short_description = "Profile Picture Preview"



@admin.register(models.ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    """
    Admin configuration for the ShippingAddress model.
    """
    list_display = (
        "name",
        "phone",
        "user",
        "city",
        "state",
        "pincode",
        "location_display",
    )
    list_filter = ("state", "city")  # Filters for easier navigation
    search_fields = ("name", "phone", "city", "state", "pincode", "user__username")
    ordering = ("state", "city")  # Orders by state and city
    list_per_page = 20  # Pagination for large datasets

    fields = (
        "user",
        "name",
        "phone",
        "pincode",
        "locality",
        "address",
        "city",
        "state",
        "landmark",
        "alternate_phone",
        "location",
    )
    readonly_fields = ("location_display",)  # Read-only display of location

    def location_display(self, obj):
        """
        Display the location name (if linked) for reference.
        """
        if obj.location:
            return str(obj.location)
        return "No Location Set"

    location_display.short_description = "Location"

    def get_queryset(self, request):
        """
        Customize the queryset to prefetch related user and location for efficiency.
        """
        return super().get_queryset(request).select_related("user", "location")



class OrderStatusFilter(SimpleListFilter):
    title = _('Order Status')
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return (
            ('pending', _('Pending')),
            ('confirmed', _('Confirmed')),
            ('cancelled', _('Cancelled')),
            ('packed', _('Packed')),
            ('shipped', _('Shipped')),
            ('out_for_delivery', _('Out for Delivery')),
            ('delivered', _('Delivered')),
        )

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(status=self.value())
        return queryset
    
class CartItemInline(admin.TabularInline):
    model = models.Order.products.through
    extra = 1
    fields = ['cartitem']  # Ensure these fields exist on CartItem

@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [CartItemInline] 
    list_display = [
        "id",
        "customer_name",
        "shipping_info",
        "status",
        "payment",
        "get_cart_total",
        "is_delivered",
        "total_products",
        "created_at",
        "view_order_details",
    ]
    
    list_filter = [
        "status", 
        "payment", 
        "created_at",
        OrderStatusFilter,
    ]
    
    search_fields = [
        "customer__first_name", 
        "customer__last_name", 
        "tracking_number", 
        "status", 
        "payment"
    ]
    
    ordering = ["-created_at"]
    actions = [
        "mark_as_pending",
        "mark_as_confirmed",
        "mark_as_cancelled",
        "mark_as_out_for_delivery",
        "mark_as_delivered",
        "delete_selected",
    ]
    
    # Display summary information in the order list
    def get_cart_total(self, obj):
        try:
            return f"₹ {obj.cart_total:.2f}"  # Assuming price is in INR
        except Exception as e:
            return f"Error: {str(e)}"
    get_cart_total.short_description = "Cart Total"
    
    def is_delivered(self, obj):
        try:
            return obj.status == "delivered"
        except Exception as e:
            return f"Error: {str(e)}"
    is_delivered.boolean = True
    is_delivered.short_description = "Delivered?"

    def total_products(self, obj):
        try:
            return obj.total_products
        except Exception as e:
            return f"Error: {str(e)}"
    total_products.short_description = "Total Products"
    
    def customer_name(self, obj):
        try:
            return f"{obj.customer.first_name} {obj.customer.last_name}"
        except Exception as e:
            return f"Error: {str(e)}"
    customer_name.short_description = "Customer"
    
    def shipping_info(self, obj):
        try:
            return f"{obj.shipping_address.name}, {obj.shipping_address.city}, {obj.shipping_address.state}"
        except Exception as e:
            return f"Error: {str(e)}"
    shipping_info.short_description = "Shipping Address"
    
    def view_order_details(self, obj):
        try:
            return format_html(f'<a href="/admin/home/order/{obj.id}/change/">View Order</a>')
        except Exception as e:
            return f"Error: {str(e)}"
    view_order_details.short_description = "Order Details"
    
    # Admin actions to change the order status
    def mark_as_pending(self, request, queryset):
        try:
            queryset.update(status="pending")
        except Exception as e:
            self.message_user(request, f"Error: {str(e)}", level="error")
    mark_as_pending.short_description = "Mark selected orders as Pending"

    def mark_as_confirmed(self, request, queryset):
        try:
            queryset.update(status="confirmed")
        except Exception as e:
            self.message_user(request, f"Error: {str(e)}", level="error")
    mark_as_confirmed.short_description = "Mark selected orders as Confirmed"

    def mark_as_cancelled(self, request, queryset):
        try:
            queryset.update(status="cancelled")
        except Exception as e:
            self.message_user(request, f"Error: {str(e)}", level="error")
    mark_as_cancelled.short_description = "Mark selected orders as Cancelled"

    def mark_as_out_for_delivery(self, request, queryset):
        try:
            queryset.update(status="out_for_delivery")
        except Exception as e:
            self.message_user(request, f"Error: {str(e)}", level="error")
    mark_as_out_for_delivery.short_description = "Mark selected orders as Out for Delivery"

    def mark_as_delivered(self, request, queryset):
        try:
            queryset.update(status="delivered")
        except Exception as e:
            self.message_user(request, f"Error: {str(e)}", level="error")
    mark_as_delivered.short_description = "Mark selected orders as Delivered"
    
    # Action to delete selected orders
    def custom_delete_selected(self, request, queryset):
        try:
            queryset.delete()
        except Exception as e:
            self.message_user(request, f"Error: {str(e)}", level="error")
    custom_delete_selected.short_description = "Delete selected orders"



@admin.register(models.Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = [
        "user_name",
        "product_name",
        "rating",
        "review_excerpt",
        "created_at",
        "view_product_link"
    ]
    list_filter = ["rating"]
    search_fields = ["user__first_name", "user__last_name", "product__name", "rating"]
    ordering = ["-created_at"]  # Show newest reviews first

    # Display user name in list view
    def user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    user_name.short_description = "User"

    # Display product name in list view
    def product_name(self, obj):
        return obj.product.name
    product_name.short_description = "Product"

    # Display rating in list view
    def rating(self, obj):
        return f"{obj.rating}/5"
    rating.short_description = "Rating"

    # Display a truncated version of the review text in list view
    def review_excerpt(self, obj):
        return format_html(
            '<span title="{}">{}</span>', obj.review, obj.review[:50] + "..." if len(obj.review) > 50 else obj.review
        )
    review_excerpt.short_description = "Review Excerpt"

    # Create a clickable link to the product page in the list view
    def view_product_link(self, obj):
        return format_html(
            '<a href="/admin/app_name/product/{}/change/">View Product</a>', obj.product.id
        )
    view_product_link.short_description = "Product Link"

    # Display the creation date in a user-friendly format
    def created_at(self, obj):
        return obj.created_at.strftime("%Y-%m-%d %H:%M:%S")
    created_at.short_description = "Created At"



@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    # Display fields in the list view
    list_display = ["name", "product_count", "image_tag", "view_products_link"]
    list_filter = ["name", "products"]  # Add filters for name and related products
    search_fields = ["name"]
    readonly_fields = ("image_tag","total_products")
    
    # Display product count
    def product_count(self, obj):
        return obj.total_products
    product_count.short_description = "Number of Products"

    # Display image preview
    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="100" style="object-fit: cover;" />', obj.image.url)
        return "No Image"
    image_tag.short_description = "Image Preview"

    # Link to view associated products in the admin
    def view_products_link(self, obj):
        url = reverse("admin:home_product_changelist") + f"?categories__id__exact={obj.id}"
        return format_html('<a href="{}">View Products</a>', url)
    view_products_link.short_description = "Products Link"

    # Inline editing for associated products
    class ProductInline(admin.TabularInline):
        model = models.Category.products.through
        extra = 1
        fields = ("product", "product_stock", "product_price", "product_rating")
        readonly_fields = ("product_stock", "product_price", "product_rating")

        # Add stock, price, and rating as read-only fields in the inline
        def product_stock(self, obj):
            return obj.product.stock if obj.product else "N/A"
        product_stock.short_description = "Stock"

        def product_price(self, obj):
            return obj.product.selling_price if obj.product else "N/A"
        product_price.short_description = "Price"

        def product_rating(self, obj):
            return obj.product.rating if obj.product else "N/A"
        product_rating.short_description = "Rating"

    inlines = [ProductInline]

    # Export category data as CSV
    actions = ["export_as_csv"]

    def export_as_csv(self, request, queryset):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="categories.csv"'
        writer = csv.writer(response)
        writer.writerow(["Name", "Total Products", "Image URL"])
        for category in queryset:
            writer.writerow([category.name, category.total_products, category.image.url if category.image else "N/A"])
        return response
    export_as_csv.short_description = "Export Selected Categories to CSV"

    def changelist_view(self, request, extra_context=None):
        # Add a bar chart for product counts across categories
        category_counts = models.Category.objects.annotate(product_count=Count("products"))
        names = [category.name for category in category_counts]
        counts = [category.product_count for category in category_counts]

        # Generate the chart
        fig = Figure()
        ax = fig.add_subplot(1, 1, 1)
        ax.bar(names, counts, color="skyblue")
        ax.set_title("Product Counts by Category")
        ax.set_ylabel("Number of Products")
        ax.set_xlabel("Categories")
        ax.tick_params(axis="x", rotation=45)

        # Save chart to a BytesIO object
        buf = io.BytesIO()
        fig.savefig(buf, format="png")
        buf.seek(0)

        # Encode the chart image to Base64
        chart_data = base64.b64encode(buf.read()).decode("utf-8")
        buf.close()

        # Add chart image to extra_context
        extra_context = extra_context or {}
        extra_context["chart"] = format_html('<img src="data:image/png;base64,{}" />', chart_data)

        return super().changelist_view(request, extra_context=extra_context)


    # Fieldsets for better organization
    fieldsets = (
        (None, {
            "fields": ("name", "image", "products")
        }),
        ("Advanced options", {
            "classes": ("collapse",),
            "fields": ("total_products",),
        }),
    )



@admin.register(models.Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    # Display the subscription email and add a date of creation for each subscription (assuming there's a `created_at` field in the model)
    list_display = ["email", "send_confirmation_email"]
    
    # Enable search functionality for emails
    search_fields = ["email"]
    
    # Enable ordering by the email field, so the list is sorted by default.
    ordering = ["email"]

    # Adding custom action for sending a confirmation email to selected subscriptions
    actions = ["send_bulk_confirmation_email"]

    # Action to send a confirmation email to selected subscriptions
    def send_bulk_confirmation_email(self, request, queryset):
        # Iterate through each selected subscription and send the confirmation email
        for subscription in queryset:
            send_mail(
                'Subscription Confirmation',
                'Thank you for subscribing to our newsletter!',
                'natesantitan@gmail.com',  # Replace with your 'from' email
                [subscription.email],
                fail_silently=False,
            )
        self.message_user(request, "Confirmation emails sent successfully.")
    
    # Short description for the action
    send_bulk_confirmation_email.short_description = "Send Confirmation Email to Selected Subscriptions"
    
    # Custom method to return the creation date of the subscription (assuming a `created_at` field exists)
    def created_at(self, obj):
        return obj.created_at.strftime("%Y-%m-%d %H:%M:%S")
    
    # Add a custom method to simulate the action of sending an email to the subscription user directly from the admin interface
    def send_confirmation_email(self, obj):
        return mark_safe(f'<a href="mailto:{obj.email}">Send Email</a>')

    # Adding a link to send emails directly from the list view
    send_confirmation_email.short_description = "Send Confirmation Email"
    send_confirmation_email.allow_tags = True  # This allows HTML rendering in the field
    
    # Define how the list should appear
    fieldsets = (
        (None, {
            'fields': ('email',),
        }),
        ('Advanced options', {
            'classes': ('collapse',),
            'fields': ('created_at',),  # Only include if `created_at` is available in your model
        }),
    )



@admin.register(models.Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ["color", "id", "hexcode", "color_tag", "total_products"]

    # Enable searching by color name and hexcode
    search_fields = ["color", "hexcode"]

    # Enable filtering by total number of products associated with the color
    list_filter = ["color"]

    # Show a preview of the color in the list view
    def color_tag(self, obj):
        return (
            mark_safe(
                f'<div style="background-color:{obj.hexcode}; width: 50px; height: 50px;"></div>'
            )
            if obj.hexcode
            else ("NA")
        )
    color_tag.short_description = "Color Preview"

    # Allow admin to click to access the associated products
    def total_products(self, obj):
        return obj.total_products
    total_products.short_description = "Total Products"

    # Add the ability to edit associated products in the color admin page (Inline admin)
    class ProductInline(admin.TabularInline):
        model = models.Color.products.through
        extra = 1
        verbose_name = "Product"
        verbose_name_plural = "Products"

    inlines = [ProductInline]

    # Custom action to associate colors with selected products (bulk update action)
    def assign_color_to_products(self, request, queryset):
        # This action would allow admins to apply the selected color to all selected products
        # For simplicity, let's assume we're applying this color to products.
        for color in queryset:
            # Here, you'd implement the logic for updating products' color attributes
            color.products.add(*models.Product.objects.all())  # Example: assigning the color to all products
        self.message_user(request, "Color assigned to selected products successfully.")

    # Add actions to assign the color to products
    actions = ["assign_color_to_products"]

    # Short description for the custom action
    assign_color_to_products.short_description = "Assign Color to Selected Products"

    # Displaying the verbose name and plural form
    class Meta:
        verbose_name = "Color"
        verbose_name_plural = "Colors"

    # Customize the form for better user experience
    fieldsets = (
        (None, {
            'fields': ('color', 'hexcode'),
        }),
        ('Advanced options', {
            'classes': ('collapse',),
            'fields': ('products',),  # Option to associate products in the form
        }),
    )
    
    

@admin.register(models.Size)
class SizeAdmin(admin.ModelAdmin):
    # Display fields in the admin list view
    list_display = [
        "size", 
        "total_products", 
        "measurements_summary",
        "id"
    ]
    list_display_links = ["size"]  # Make the size field clickable

    # Enable searching by size and measurements
    search_fields = [
        "size", 
        "bust", 
        "chest", 
        "waist", 
        "hip", 
        "neck_circumference"
    ]

    # Add filters for sorting
    list_filter = ["size", "bust", "waist", "hip"]

    # Custom actions for batch updates
    actions = ["clear_measurements"]

    # Enable inline editing of associated products
    class ProductInline(admin.TabularInline):
        model = models.Size.products.through
        extra = 1  # Number of blank forms
        verbose_name = "Product"
        verbose_name_plural = "Associated Products"

    inlines = [ProductInline]

    # Fieldsets for organizing the form
    fieldsets = (
        (None, {
            "fields": ("size",)
        }),
        ("Upper Body Measurements", {
            "fields": (
                "bust", 
                "chest", 
                "shoulder", 
                "top_length", 
                "sleeve_length", 
                "cuff_circumference", 
                "bicep_circumference"
            ),
        }),
        ("Lower Body Measurements", {
            "fields": (
                "hip", 
                "rise", 
                "waist", 
                "thigh", 
                "pant_length", 
                "inseam_length", 
                "knee_circumference", 
                "ankle_circumference"
            ),
        }),
        ("Full Body/Dress Measurements", {
            "fields": (
                "dress_length", 
                "shoulder_to_hip", 
                "shoulder_to_knee", 
                "shoulder_to_waist", 
                "shoulder_to_ankle", 
                "neck_circumference"
            ),
        }),
        ("Associated Products", {
            "classes": ("collapse",),  # Collapsible fieldset for a cleaner UI
            "fields": ("products",),
        }),
    )

    # Custom methods
    @admin.display(description="Body Measurements Summary")
    def measurements_summary(self, obj):
        """
        Summarizes key body measurements.
        """
        measurements = []
        if obj.bust: measurements.append(f"Bust: {obj.bust} cm")
        if obj.chest: measurements.append(f"Chest: {obj.chest} cm")
        if obj.waist: measurements.append(f"Waist: {obj.waist} cm")
        if obj.hip: measurements.append(f"Hip: {obj.hip} cm")
        return mark_safe("<br>".join(measurements)) if measurements else "No data available"

    @admin.display(description="Total Products")
    def total_products(self, obj):
        """
        Displays the total number of products associated with a size.
        """
        return obj.products.count()

    # Custom action to clear all measurements
    @admin.action(description="Clear Measurements for Selected Sizes")
    def clear_measurements(self, request, queryset):
        """
        Clears all body measurements for the selected sizes.
        """
        queryset.update(
            bust=None, chest=None, waist=None, hip=None, 
            shoulder=None, top_length=None, sleeve_length=None, 
            cuff_circumference=None, bicep_circumference=None,
            rise=None, thigh=None, pant_length=None, 
            inseam_length=None, knee_circumference=None, 
            ankle_circumference=None, dress_length=None, 
            shoulder_to_hip=None, shoulder_to_knee=None, 
            shoulder_to_waist=None, shoulder_to_ankle=None, 
            neck_circumference=None,
        )
        self.message_user(request, "All measurements cleared for the selected sizes.")



@admin.register(models.CartItem)
class CartItemAdmin(admin.ModelAdmin):
    # Display fields in the admin list view
    list_display = ["product", "quantity","price_display", "total","size", "color_display", "image_display", "user_display", "is_ordered_display", "created"]
    list_display_links = ["product"]  # Make the product field clickable

    # Enable search functionality for related fields
    search_fields = ["product__name", "size__size", "user__email"]

    # Filter by product, size, user, created date, and order status
    list_filter = ["product", "size", "user", "created"]

    # Define ordering of items in the list view
    ordering = ["-created"]

    # Define readonly fields
    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ["product", "user", "created"]  # Make fields readonly after creation
        return []

    # Organize fields into collapsible sections
    fieldsets = (
        (None, {
            "fields": ("product", "user", "size", "quantity"),
        }),
        ("Additional Information", {
            "fields": (),
        }),
    )

    # Custom price display
    def price_display(self, obj):
        if obj.product:
            return f"₹ {obj.product.selling_price:.2f}"  # Replace ₹ with the currency symbol as needed
        return "N/A"
    price_display.short_description = "Price"
    
    def total(self,obj):
        if obj.product:
            return f"₹ {(obj.product.selling_price*obj.quantity):.2f}"
        return "N/A"
    total.short_description = "Grand Total"

    # Custom image display
    def image_display(self, obj):
        if obj.product and obj.product.images:
            return mark_safe(f'<img src="{obj.product.images[0].image.url}" width="50" height="50" />')
        return "No Image"
    image_display.short_description = "Product Image"

    # Custom color display
    def color_display(self, obj):
        if hasattr(obj.product, "color") and obj.product.color:
            return mark_safe(f'<div style="background-color:{obj.product.color.hexcode}; width: 50px; height: 20px;"></div>')
        return "No Color"
    color_display.short_description = "Product Color"

    # Custom user display
    def user_display(self, obj):
        return obj.user.email if obj.user else "Anonymous"
    user_display.short_description = "User"

    # Custom is_ordered display
    def is_ordered_display(self, obj):
        return obj.is_ordered
    is_ordered_display.short_description = "Is Ordered"
    is_ordered_display.boolean = True  # Display as a boolean field in the admin panel

    # Batch delete action
    def delete_selected_items(self, request, queryset):
        queryset.delete()
        self.message_user(request, "Selected cart items have been deleted.")
    delete_selected_items.short_description = "Delete selected cart items"

    # Register custom actions
    actions = ["delete_selected_items"]

    # Override get_search_results for more control over search functionality
    def get_search_results(self, request, queryset, search_term):
        """
        Customize the search functionality.
        """
        qs, use_distinct = super().get_search_results(request, queryset, search_term)
        if search_term:
            qs = qs.filter(product__name__icontains=search_term)
        return qs, use_distinct

    # Customize the save behavior
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created = obj.created or timezone.now()  # Set default created date
        super().save_model(request, obj, form, change)
        
        