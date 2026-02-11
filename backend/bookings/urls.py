from django.urls import path

from backend.accounts.views import RegisterView

path("api/register/", RegisterView.as_view(), name="register"),
