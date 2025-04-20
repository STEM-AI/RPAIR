from rest_framework.permissions import AllowAny
from ...serializers import EventSerializer , EventListSerializer
from ...permissions import IsSuperUser 
from ...models import CompetitionEvent,Competition 
from rest_framework.generics import ListAPIView,RetrieveAPIView,CreateAPIView
from rest_framework import serializers


class EventCreateView(CreateAPIView):
    permission_classes = [IsSuperUser]
    serializer_class = EventSerializer
    queryset = CompetitionEvent.objects.all()

    def perform_create(self, serializer):
        competition_name = self.kwargs.get('competition_name')
        try:
            competition = Competition.objects.get(name=competition_name)
        except Competition.DoesNotExist:
            raise serializers.ValidationError({"competition_name": "Competition not found."})
        
        serializer.save(competition=competition)
        
class EventsListWithTop3TeamsView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = EventListSerializer

    def get_queryset(self):
        competition_name = self.kwargs.get('competition_name')
        print("competition_name" , competition_name)
        return (
            CompetitionEvent.objects
            .select_related('competition')
            .filter(competition__name=competition_name)
            .all()
            )

            
class EventProfileView(RetrieveAPIView):
    permission_classes = [IsSuperUser]
    serializer_class = EventSerializer
    lookup_url_kwarg = 'event_name'
    lookup_field = 'name'  # Lookup by event name instead of the default 'pk'
    queryset = CompetitionEvent.objects.all()
    
      