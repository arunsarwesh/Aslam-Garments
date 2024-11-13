from django import forms
from django.contrib import admin, messages
from django.shortcuts import redirect
from django.utils.html import mark_safe
from .models import (
    Customer,
    Address,
    Product,
    OrderItem,
    Order,
    image,
    Category,
    Subscription,
    Color,
    location,
    ProductVariant,
    Size,
    BulkProductItem,
    BulkProducts,
    CartItem,
)
from rest_framework.authtoken.admin import TokenAdmin
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.template.response import TemplateResponse
from django.urls import path, reverse
from django.contrib.admin import AdminSite

TokenAdmin.raw_id_fields = ["user"]
admin.site.site_header = "AG Admin"
admin.site.site_title = "Admin site"
admin.site.index_title = "AG Admin"


# Inline for images
class ImageInline(admin.TabularInline):
    model = image
    extra = 1
    fields = ("image_tag", "image", "is_main")
    readonly_fields = ("image_tag",)

    def image_tag(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="100" height="100" />')
        return "NA"

    image_tag.short_description = "Image"


# Inline for categories
class CategoryInline(admin.TabularInline):
    model = Category.products.through
    extra = 1
    fields = ("category",)


# Inline for colors
class ColorInline(admin.TabularInline):
    model = Color.products.through
    extra = 1
    fields = ("color",)


class SizeInline(admin.TabularInline):
    model = Size.products.through
    extra = 1
    fields = ("size",)


# Admin form for Product
class ProductAdminForm(forms.ModelForm):
    tags = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={"placeholder": "Enter tags separated by commas"}),
        help_text="Enter tags separated by commas, e.g., 'tag1, tag2, tag3'",
    )
    fabric = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={"placeholder": "Enter fabrics used in the product"}),
        help_text="Enter fabrics used in the product separated by commas, e.g., 'cotton, silk, wool'",
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            self.initial["tags"] = ", ".join(self.instance.tags) if isinstance(self.instance.tags, list) else ""
            self.initial["fabric"] = ", ".join(self.instance.fabric) if isinstance(self.instance.fabric, list) else ""
            

    class Meta:
        model = Product
        fields = [
            "name",
            "discription",
            "stock",
            "marketPrice",
            "sellingPrice",
            "product_color",
            "product_size",
            "tags",
            "gsm",
            "net_weight",
            "fabric",
            "product_type",
            "sleeve",
            "fit",
            "ideal_for",
        ]
        widgets = {
            "category": forms.CheckboxSelectMultiple,
            "color": forms.CheckboxSelectMultiple,
            "sizes": forms.CheckboxSelectMultiple,
        }

    def clean_tags(self):
        tags = self.cleaned_data["tags"]
        return [tag.strip() for tag in tags.split(",") if tag.strip()]
    
    def clean_fabric(self):
        fabric = self.cleaned_data["fabric"]
        return [fabric.strip() for fabric in fabric.split(",") if fabric.strip()]


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ["display_products", "total_products", "id"]
    list_filter = ["product"]
    search_fields = ["product__name"]

    def display_products(self, obj):
        products = obj.product.all()
        return " | ".join(
            [
                str(product.name) + " - " + str(product.product_color).upper()
                for product in products
            ]
        )

    display_products.short_description = "Products"

    def total_products(self, obj):
        return obj.product.count()

    total_products.short_description = "Total Products"


# Product admin
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    inlines = [ImageInline, CategoryInline, ColorInline, SizeInline]
    list_display = [
        "name",
        "id",
        "marketPrice",
        "sellingPrice",
        "stock",
        "product_color",
        "main_image_tag",
        "additional_images_tag",
        "color_code",
        "tagsvalue",
    ]
    search_fields = ["name"]
    list_filter = ["category", "color", "product_size"]

    def tagsvalue(self, obj):
        return "| : |".join(obj.tags or [])

    def save_formset(self, request, form, formset, change):
        if formset.model == image:
            instances = formset.save(commit=False)
            for instance in instances:
                instance.belongs_to = form.instance
                instance.save()
                form.instance.images.add(
                    instance
                )  # Add the image to the many-to-many field
            formset.save_m2m()
        else:
            formset.save()

    def main_image_tag(self, obj):
        main_image = obj.mainImage
        if main_image and main_image.image:
            return mark_safe(
                f'<img src="{main_image.image.url}" width="50" height="50" />'
            )
        return "-"

    main_image_tag.short_description = "Main Image"

    def color_code(self, obj):
        if obj.product_color:
            flex = (
                "display:flex;justify-content:center;align-items:center;font-size:16px;"
            )
            return mark_safe(
                f'<span style="width:60px; height:40px; background-color:{obj.product_color.hexcode};{flex}border-radius:1rem;color:white;-webkit-text-stroke: 1px black;font-weight:900;">{str(obj.product_color.hexcode).strip("#")}<span/>'
            )
        return None

    def additional_images_tag(self, obj):
        images_html = ""
        for img in obj.notMainImages:
            if img.image:
                images_html += f'<img src="{img.image.url}" width="50" height="50" style="margin-right: 5px;" />'
        return mark_safe(images_html if images_html else "-")

    additional_images_tag.short_description = "Additional Images"


# Customer admin
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ["profilePic", "user", "cart_items", "Cart_Item_Images", "address"]

    def Cart_Item_Images(self, obj):
        txt = ""
        for item in obj.cart.all():
            txt += (
                f'<img src="{item.product.mainImage.image.url}" width="60" height="60" style="margin-right: 10px;" />'
                if item.product.mainImage.image
                else ""
            )
        return mark_safe(txt)

    def profilePic(self, obj):
        return mark_safe(f'<img src="{obj.pic.url}" width="100" height="150" />')


# Address admin
@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = [
        "doorNo",
        "buildingName",
        "street",
        "city",
        "state",
        "country",
        "pincode",
        "landmark",
        "location",
        "phone",
    ]


# OrderItem admin
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ["product", "quantity", "date_added"]


# Order admin
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "customer",
        "date",
        "status",
        "payment",
        "get_cart_total",
        "is_deliveried",
        "total_products",
    ]

    list_filter = ["status", "payment"]

    actions = [
        "mark_as_pending",
        "mark_as_confirmed",
        "mark_as_cancelled",
        "mark_as_out_for_delivery",
        "mark_as_delivered",
        "delete_selected",
    ]

    def mark_as_pending(self, request, queryset):
        queryset.update(status="pending")

    def mark_as_confirmed(self, request, queryset):
        queryset.update(status="confirmed")

    def mark_as_cancelled(self, request, queryset):
        queryset.update(status="cancelled")

    def mark_as_out_for_delivery(self, request, queryset):
        queryset.update(status="out_for_delivery")

    def mark_as_delivered(self, request, queryset):
        queryset.update(status="delivered")

    def custom_delete_selected(self, request, queryset):
        queryset.delete()

    mark_as_pending.short_description = "Mark selected orders as Pending"
    mark_as_confirmed.short_description = "Mark selected orders as Confirmed"
    mark_as_cancelled.short_description = "Mark selected orders as Cancelled"
    mark_as_out_for_delivery.short_description = (
        "Mark selected orders as Out for delivery"
    )
    mark_as_delivered.short_description = "Mark selected orders as Delivered"


# Image admin
@admin.register(image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ["image_tag", "is_main", "belongs_to"]

    def image_tag(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="50" height="50" />')
        return "-"

    image_tag.short_description = "Image"


# Category admin
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "image_tag"]
    list_filter = ["name"]
    readonly_fields = ("image_tag",)

    def image_tag(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="100" height="100" />')
        return "NA"

    image_tag.short_description = "Image"


# Subscription admin
@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ["email"]


# Color admin
@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ["color", "id", "hexcode", "color_tag"]

    def color_tag(self, obj):
        return (
            mark_safe(
                f'<div style="background-color:{obj.hexcode}; width: 50px; height: 50px;"></div>'
            )
            if obj.hexcode
            else ("NA")
        )


@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ["size", "id"]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ["product", "quantity", "size", "color", "created", "image"]

    def image(self, obj):
        return mark_safe(
            f'<img src="{obj.product.mainImage.image.url}" width="50" height="50" />'
        )


@admin.register(BulkProductItem)
class BulkProductItemAdmin(admin.ModelAdmin):
    list_display = ["product", "bulk_qty"]


class BulkProductItemInline(admin.TabularInline):
    model = BulkProductItem
    extra = 1
    fields = ("product", "bulk_qty")


@admin.register(BulkProducts)
class BulkProductsAdmin(admin.ModelAdmin):
    inlines = [
        BulkProductItemInline,
    ]
    list_display = ["name", "discription", "all_Items"]

    def all_Items(self, obj):
        return " | ".join(
            [
                f"{item.product.name} ({item.product.product_color}) - {item.bulk_qty}"
                for item in obj.bulk_items.all()
            ]
        )


# Custom admin site
class MyAdminSite(AdminSite):
    site_header = "AG Admin"
    site_title = "Admin site"
    index_title = "AG Admin"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path("", self.admin_view(self.custom_index), name="index"),
            path("NewOrders/", self.admin_view(self.pending), name="NewOrders"),
            path(
                "NewOrders/<int:pk>/",
                self.admin_view(self.check_pending),
                name="check_pending",
            ),
            path(
                "NewOrders/<int:pk>/accept/",
                self.admin_view(self.accept_order),
                name="AcceptOrder",
            ),
            path(
                "NewOrders/<int:pk>/reject/",
                self.admin_view(self.reject_order),
                name="RejectOrder",
            ),
        ]

        return custom_urls + urls

    def custom_index(self, request, extra_context=None):
        model_order = [
            "Product",
            "Order",
            "Customer",
            "Address",
            "OrderItem",
            "Image",  # Ensure this matches the actual object_name
            "Category",
            "Subscription",
            "Color",
        ]
        app_list = self.get_app_list(request)
        for app in app_list:
            app["models"].sort(
                key=lambda x: (
                    model_order.index(x["object_name"])
                    if x["object_name"] in model_order
                    else 100
                )
            )
        pending_orders = Order.objects.filter(status="pending").count()
        confirmed_orders = Order.objects.filter(status="confirmed").count()
        shipped_orders = Order.objects.filter(status="shipped").count()
        context = {
            **self.each_context(request),
            "title": self.index_title,
            "app_list": app_list,
            "pending_orders": pending_orders,
            "confirmed_orders": confirmed_orders,
            "shipped_orders": shipped_orders,
        }
        return TemplateResponse(request, "admin/index.html", context)

    def pending(self, request, extra_context=None):
        pending_orders = Order.objects.filter(status="pending")
        cont = {
            **self.each_context(request),
            "pending_orders": pending_orders,
        }
        return TemplateResponse(request, "admin/new_orders.html", cont)

    def check_pending(self, request, pk, extra_context=None):
        order = Order.objects.get(pk=pk)
        context = {
            **self.each_context(request),
            "title": f"Order {order.id}",
            "order": order,
        }
        return TemplateResponse(request, "admin/new_order_view.html", context)

    def accept_order(self, request, pk, extra_context=None):
        try:
            order = Order.objects.get(pk=pk)
            order.status = "confirmed"  # Update status as needed
            order.save()
            messages.success(request, "Order has been accepted.")
        except Order.DoesNotExist:
            messages.error(request, "Order not found.")
        return redirect(f"/admin/NewOrders/{pk}/")

    def reject_order(self, request, pk, extra_context=None):
        try:
            order = Order.objects.get(pk=pk)
            order.status = "cancelled"  # Update status as needed
            order.save()
            messages.success(request, "Order has been rejected.")
        except Order.DoesNotExist:
            messages.error(request, "Order not found.")
        return redirect(f"/admin/NewOrders/{pk}/")


admin_site = MyAdminSite(name="myadmin")

# Registering models with custom admin site
admin_site.register(Order, OrderAdmin)
admin_site.register(Customer, CustomerAdmin)
admin_site.register(Address, AddressAdmin)
admin_site.register(OrderItem, OrderItemAdmin)
admin_site.register(Product, ProductAdmin)
admin_site.register(image, ImageAdmin)
admin_site.register(Category, CategoryAdmin)
admin_site.register(Subscription, SubscriptionAdmin)
admin_site.register(Color, ColorAdmin)
admin_site.register(ProductVariant, ProductVariantAdmin)
admin_site.register(Size, SizeAdmin)
admin_site.register(CartItem, CartItemAdmin)
