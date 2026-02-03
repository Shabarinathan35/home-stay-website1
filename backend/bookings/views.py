import stripe
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from .models import Booking
from .serializers import BookingSerializer
from rest_framework import viewsets, permissions, serializers
from .models import Booking
from .serializers import BookingSerializer
from django.core.mail import send_mailfrom django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # existing confirmation email logic here...
        booking = serializer.save(user=self.request.user)
        # send confirmation email (already implemented)

    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()
        room = booking.room
        check_in = booking.check_in
        check_out = booking.check_out
        username = booking.user.username
        email = booking.user.email

        # Delete booking
        response = super().destroy(request, *args, **kwargs)

        # Send cancellation email
        subject = "Booking Cancellation"
        from_email = "hotel@example.com"
        to_email = [email]

        text_content = f"Dear {username},\nYour booking for Room {room.room_number} from {check_in} to {check_out} has been cancelled."
        html_content = render_to_string("emails/booking_cancellation.html", {
            "username": username,
            "room": room,
            "check_in": check_in,
            "check_out": check_out,
        })

        msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        return response


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        room = serializer.validated_data['room']
        check_in = serializer.validated_data['check_in']
        check_out = serializer.validated_data['check_out']

        # Prevent double booking
        if Booking.objects.filter(room=room, check_in__lt=check_out, check_out__gt=check_in).exists():
            raise serializers.ValidationError("Room is already booked for these dates.")

        booking = serializer.save(user=self.request.user)

        # Send confirmation email
        send_mail(
            subject="Booking Confirmation",
            message=f"Dear {self.request.user.username},\n\n"
                    f"Your booking for Room {room.room_number} "
                    f"from {check_in} to {check_out} has been confirmed.\n\n"
                    f"Thank you for choosing our hotel!",
            from_email="hotel@example.com",  # or DEFAULT_FROM_EMAIL
            recipient_list=[self.request.user.email],
            fail_silently=False,
        )

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        room = serializer.validated_data['room']
        check_in = serializer.validated_data['check_in']
        check_out = serializer.validated_data['check_out']
        if Booking.objects.filter(room=room, check_in__lt=check_out, check_out__gt=check_in).exists():
            raise serializers.ValidationError("Room is already booked for these dates.")
        serializer.save(user=self.request.user)


stripe.api_key = "your_secret_key"

@api_view(['POST'])
def create_payment(request):
    amount = request.data.get("amount")
    intent = stripe.PaymentIntent.create(
        amount=int(amount * 100),  # convert to cents
        currency="usd",
        payment_method_types=["card"],
    )
    return Response({"client_secret": intent.client_secret})

# bookings/views.py

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



def perform_create(self, serializer):
    room = serializer.validated_data['room']
    check_in = serializer.validated_data['check_in']
    check_out = serializer.validated_data['check_out']

    # Prevent double booking
    if Booking.objects.filter(room=room, check_in__lt=check_out, check_out__gt=check_in).exists():
        raise serializers.ValidationError("Room is already booked for these dates.")

    booking = serializer.save(user=self.request.user)

    # Customer confirmation email (already implemented)

    # Admin notification email
    subject = "New Booking Alert"
    text_content = f"New booking: {self.request.user.username} booked Room {room.room_number} from {check_in} to {check_out}."
    html_content = render_to_string("emails/admin_booking_alert.html", {
        "username": self.request.user.username,
        "room": room,
        "check_in": check_in,
        "check_out": check_out,
    })

    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, settings.ADMIN_EMAILS)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

def destroy(self, request, *args, **kwargs):
    booking = self.get_object()
    room = booking.room
    check_in = booking.check_in
    check_out = booking.check_out
    username = booking.user.username

    response = super().destroy(request, *args, **kwargs)

    # Admin cancellation email
    subject = "Booking Cancelled"
    text_content = f"Booking cancelled: {username} cancelled Room {room.room_number} from {check_in} to {check_out}."
    html_content = render_to_string("emails/admin_booking_cancel.html", {
        "username": username,
        "room": room,
        "check_in": check_in,
        "check_out": check_out,
    })

    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, settings.ADMIN_EMAILS)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

    return response
