import MIDDLEWARE

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}
# settings.py
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your_email@gmail.com'       # replace with your email
EMAIL_HOST_PASSWORD = 'your_app_password'      # use app password, not your real password
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# settings.py
ADMIN_EMAILS = ["hotelstaff@example.com", "manager@example.com"]

INSTALLED_APPS += ['corsheaders']
MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware'] + MIDDLEWARE
CORS_ALLOW_ALL_ORIGINS = True
