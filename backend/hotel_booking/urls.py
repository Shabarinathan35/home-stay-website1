from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from rooms.views import RoomViewSet
from bookings.views import BookingViewSet, available_rooms

router = DefaultRouter()
router.register("rooms", RoomViewSet)
router.register("bookings", BookingViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/rooms/available/", available_rooms),
    path("api/token/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path("api/accounts/", include("accounts.urls")),
]
