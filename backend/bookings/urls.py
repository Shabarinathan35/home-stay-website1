from django.urls import path

path("api/register/", RegisterView.as_view(), name="register"),
