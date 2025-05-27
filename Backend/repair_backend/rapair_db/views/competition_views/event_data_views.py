from rest_framework.permissions import AllowAny
from ...serializers import EventSerializer , EventListSerializer
from ...permissions import IsSuperUser, IsOrganizationOwner
from ...models import CompetitionEvent,Competition 
from rest_framework.generics import ListAPIView,RetrieveAPIView,CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
import logging

logger = logging.getLogger(__name__)

class EventCreateView(CreateAPIView):
    queryset = CompetitionEvent.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, (IsSuperUser | IsOrganizationOwner)]

    def perform_create(self, serializer):
        competition_id = self.request.data.get('competition')
        if not competition_id:
            raise serializers.ValidationError(
                {"competition": "Competition ID is required."}
            )
        
        try:
            competition = Competition.objects.get(id=competition_id)
        except Competition.DoesNotExist:
            raise serializers.ValidationError(
                {"competition": "Invalid competition ID."}
            )
        
        serializer.save(competition=competition)

class EventListView(ListAPIView):
    queryset = CompetitionEvent.objects.all()
    serializer_class = EventListSerializer
    permission_classes = [IsAuthenticated]

class EventDetailView(RetrieveUpdateDestroyAPIView):
    queryset = CompetitionEvent.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, (IsSuperUser | IsOrganizationOwner)]

class EventsListWithTop3TeamsView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = EventListSerializer

    def get_queryset(self):
        competition_name = self.kwargs.get('competition_name')
        logger.info(f"competition_name: {competition_name}")
        return (
            CompetitionEvent.objects
            .select_related('competition')
            .filter(competition__name=competition_name)
            )

            
class EventProfileView(RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = EventSerializer
    lookup_url_kwarg = 'event_name'
    lookup_field = 'name'  # Lookup by event name instead of the default 'pk'
    queryset = CompetitionEvent.objects.all()

class LiveEventListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = EventSerializer
    queryset = CompetitionEvent.objects.filter(is_live=True)
    
      