import stripe

from django.conf import settings
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string

from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.exceptions import ValidationError, NotFound

from .models import Booking
from .serializers import BookingSerializer
from rooms.models import Room


# --------------------------------------------------
# Stripe configuration
# --------------------------------------------------
stripe.api_key = settings.STRIPE_SECRET_KEY


# ==================================================
# ADMIN BOOKINGS (READ ONLY)
# ==================================================
class AdminBookingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Booking.objects.select_related("user", "room")
    serializer_class = BookingSerializer
    permission_classes = [IsAdminUser]


# ==================================================
# BOOKINGS (USER)
# ==================================================
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Booking.objects.all()
        return Booking.objects.filter(user=user)

    @action(detail=False, methods=["get"])
    def my_bookings(self, request):
        bookings = Booking.objects.filter(user=request.user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        room = serializer.validated_data["room"]
        check_in = serializer.validated_data["check_in"]
        check_out = serializer.validated_data["check_out"]

        if check_in >= check_out:
            raise ValidationError("Check-out date must be after check-in date.")

        # Prevent double booking
        if Booking.objects.filter(
            room=room,
            check_in__lt=check_out,
            check_out__gt=check_in
        ).exists():
            raise ValidationError("Room already booked for selected dates.")

        booking = serializer.save(user=self.request.user)

        # -------------------------
        # Customer confirmation email
        # -------------------------
        html_content = render_to_string(
            "emails/booking_confirmation.html",
            {
                "username": self.request.user.username,
                "room": room,
                "check_in": check_in,
                "check_out": check_out,
            }
        )

        send_mail(
            subject="Booking Confirmation",
            message="Your booking has been confirmed.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[self.request.user.email],
            html_message=html_content,
            fail_silently=False,
        )

        # -------------------------
        # Admin notification email
        # -------------------------
        admin_html = render_to_string(
            "emails/admin_booking_alert.html",
            {
                "username": self.request.user.username,
                "room": room,
                "check_in": check_in,
                "check_out": check_out,
            }
        )

        admin_email = EmailMultiAlternatives(
            subject="New Booking Alert",
            body="A new booking has been created.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=settings.ADMIN_EMAILS,
        )
        admin_email.attach_alternative(admin_html, "text/html")
        admin_email.send()

    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()

        if booking.user != request.user and not request.user.is_staff:
            raise ValidationError("You are not allowed to cancel this booking.")

        html_content = render_to_string(
            "emails/booking_cancellation.html",
            {
                "username": booking.user.username,
                "room": booking.room,
                "check_in": booking.check_in,
                "check_out": booking.check_out,
            }
        )

        response = super().destroy(request, *args, **kwargs)

        send_mail(
            subject="Booking Cancelled",
            message="Your booking has been cancelled.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.user.email],
            html_message=html_content,
            fail_silently=False,
        )

        return response


# ==================================================
# PAYMENTS
# ==================================================
@api_view(["POST"])
def create_payment(request):
    amount = request.data.get("amount")

    if not amount:
        raise ValidationError("Amount is required.")

    try:
        intent = stripe.PaymentIntent.create(
            amount=int(float(amount) * 100),
            currency="usd",
            payment_method_types=["card"],
        )
    except Exception as e:
        raise ValidationError(str(e))

    return Response({"client_secret": intent.client_secret})


@api_view(["POST"])
def confirm_payment(request):
    booking_id = request.data.get("booking_id")

    if not booking_id:
        raise ValidationError("booking_id is required.")

    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        raise NotFound("Booking not found.")

    booking.payment_status = "paid"
    booking.save()

    return Response({"status": "Payment confirmed"})


# ==================================================
# ROOM AVAILABILITY
# ==================================================
@api_view(["GET"])
def available_rooms(request):
    check_in = request.GET.get("check_in")
    check_out = request.GET.get("check_out")

    if not check_in or not check_out:
        raise ValidationError("check_in and check_out are required.")

    booked_rooms = Booking.objects.filter(
        check_in__lt=check_out,
        check_out__gt=check_in
    ).values_list("room_id", flat=True)

    rooms = Room.objects.exclude(id__in=booked_rooms)

    data = [
        {
            "id": room.id,
            "room_number": room.room_number,
            "room_type": room.room_type,
            "price": room.price,
        }
        for room in rooms
    ]

    return Response(data)


# ==================================================
# ADMIN DASHBOARD
# ==================================================
@api_view(["GET"])
def admin_dashboard(request):
    if not request.user.is_staff:
        raise ValidationError("Admin access only.")

    return Response({
        "total_bookings": Booking.objects.count(),
        "paid_bookings": Booking.objects.filter(payment_status="paid").count(),
        "pending_payments": Booking.objects.filter(payment_status="pending").count(),
        "total_rooms": Room.objects.count(),
    })
