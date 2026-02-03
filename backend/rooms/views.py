from rest_framework import viewsets
from .models import Room
from .serializers import RoomSerializer
from rest_framework import viewsets
from .models import Room
from .serializers import RoomSerializer

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get_queryset(self):
        queryset = Room.objects.all()
        room_type = self.request.query_params.get('type')
        price_min = self.request.query_params.get('price_min')
        price_max = self.request.query_params.get('price_max')

        if room_type:
            queryset = queryset.filter(room_type=room_type)
        if price_min and price_max:
            queryset = queryset.filter(price__gte=price_min, price__lte=price_max)

        return queryset

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

