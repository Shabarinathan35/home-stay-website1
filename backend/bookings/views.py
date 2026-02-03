import stripe
from rest_framework.decorators import api_view
from rest_framework.response import Response

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
