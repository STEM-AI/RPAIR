from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ...serializers import EventSerializer , EventListSerializer
from ...permissions import IsSuperUser 
from ...utils import event_utils
from ...models import CompetitionEvent 
from rest_framework.generics import ListAPIView , RetrieveAPIView 

class EventCreateView(APIView):
    permission_classes = [IsSuperUser]
    serializer_class = EventSerializer
    def post(self, request):
        competition = event_utils.get_object(request.data.get('competition_name'))
        if competition is None:
            return Response({"error": "Competition not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(competition=competition)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
class EventsListWithTop3TeamsView(ListAPIView):
    permission_classes = [IsAuthenticated]
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
    
      