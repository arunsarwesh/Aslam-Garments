from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path("shop/",views.shop,name='shop'),
    # path("makeProduct/",views.makeProduct,name='makeProduct'),
]