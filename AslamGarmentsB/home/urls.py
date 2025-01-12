from django.urls import path
from . import views, fakedata

urlpatterns = [
    path("getCat/", views.getCategories, name="getCategories"),
    path("subscribe/", views.makeSubscription, name="Make Subscription"),
    path("getcolor/", views.getcolors, name="Get Colors"),
    path("getSizes/", views.getsizes, name="Get Sizes"),
    path("addtocart/", views.addCartItem, name="Add To Cart"),
    path("getCart/", views.get_cart, name="Get Cart"),
    path("updateCart/", views.updateCartItem, name="Update Cart"),
    path("isWholeSaleUser/", views.isWholeSaleUser, name="Check WholeSale User"),
    path("getWholeSaleProducts/",views.getWholeSaleProducts,name="Get WholeSale Products",),
    
    
    
    path("checkAuth/", views.checkAuth, name="checkAuth"),
    path("signup/", views.register, name="register"),
    path("login/", views.CustomAuthToken.as_view(), name="login"),
    path("logout/", views.logout, name="logout"),
    path("home/", views.Home, name="Home"),
    path("getProduct/<str:slug>/", views.getProduct, name="Get Product"),
    path("order/", views.order, name="Get Order"),
    path("products/", views.ProductListView.as_view(), name="products"),
    path("review/", views.Review, name="Add Review"),
    path("getReviews/<int:pid>/", views.GetReview, name="Get Reviews"),
    path("add2cart/",views.AddToCart,name="Add To Cart"),
    path("cart/",views.Cart,name="Cart"),
    path("profile/", views.profile, name="Profile"),
    path("verify_payment/",views.verify_payment,name="Verify Payment"),
    path("create_razorpay_order/",views.create_razorpay_order,name="Create Razorpay Order"),
    # path("fake/",fakedata.add_fake_sizes_for_tops_and_pants,name="Fake Data"),
]
