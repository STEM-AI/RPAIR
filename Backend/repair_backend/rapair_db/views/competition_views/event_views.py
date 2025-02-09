from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...serializers import EventSerializer , EventListSerializer
from ...permissions import IsSuperUser ,IsJudgeUser
from django.db import connection
from ...utils import event_utils
from ...models import EventGame , Team , CompetitionEvent
from ...serializers import EventGameSerializer
from rest_framework.permissions import AllowAny
from django.db import IntegrityError
from django.db.models import Avg
from ...models import TeamworkTeamScore
from ...serializers import TeamworkScoreSerializer , TeamInterviewScoreSerializer , TeamEngNotebookScoreSerializer
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
    permission_classes = [IsSuperUser]
    serializer_class = EventListSerializer
    lookup_url_kwarg = 'event_name'
    lookup_field = 'name'
    queryset = CompetitionEvent.objects.all()

    

class CreateScheduleEventGameView(APIView):
    permission_classes = [AllowAny]
    serializer_class = EventGameSerializer

    def post(self, request , event_name=None):
        if not event_name:
            return Response({"error": "Event name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        event = event_utils.get_object(event_name=event_name)
        if not event:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            stage_games = event_utils.create_schedule(event=event,stage=request.data.get('stage'), time= request.data.get('time'))
            if isinstance(stage_games, Response):  # Check if the response is already handled
                return stage_games

            serializer = EventGameSerializer(stage_games, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except IntegrityError as e:
            return Response({"error": f"Integrity error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class GetEventSchedule(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = EventGameSerializer

    def get_queryset(self):
        event_name = self.kwargs.get('event_name')
        if not event_name:
            return EventGame.objects.none()
        event = event_utils.get_object(event_name=event_name)
        return EventGame.objects.filter(event=event).order_by('time')

                
            
class EventProfileView(RetrieveAPIView):
    permission_classes = [IsSuperUser]
    serializer_class = EventSerializer
    lookup_url_kwarg = 'event_name'
    lookup_field = 'name'  # Lookup by event name instead of the default 'pk'
    queryset = CompetitionEvent.objects.all()
    
class TeamWorkRankView(ListAPIView):
    '''Rank teams based on Average of thier Teamwork Score For Event'''
    permission_classes = [IsJudgeUser]
    serializer_class = TeamworkScoreSerializer
    def get_queryset(self):
        event_name = self.kwargs.get('event_name')
        if not event_name:
            return TeamworkTeamScore.objects.none()
        return (
                TeamworkTeamScore.objects
                .filter(team__competition_event__name=event_name)  # Filter by event name
                .select_related('team')  # Fetch the related Team model
                .values('team', 'team__name')  # Include team name directly
                .annotate(avg_score=Avg('score'))
                .order_by('-avg_score')
                )
    
        
class TeamsInterviewScoreRankView(ListAPIView):
    permission_classes = [IsJudgeUser]
    serializer_class = TeamInterviewScoreSerializer
    def get_queryset(self):
        event_name = self.kwargs.get('event_name')
        if not event_name:
            return Team.objects.none()
        return (Team.objects
                .select_related('competition_event')
                .filter(competition_event__name=event_name)
                .order_by('-interview_score')
                )

class TeamsEngNotebookScoreRank(ListAPIView):
    permission_classes = [IsJudgeUser]
    serializer_class = TeamEngNotebookScoreSerializer
    def get_queryset(self):
        event_name = self.kwargs.get('event_name')
        if not event_name:
            return Team.objects.none()
        return (Team.objects
                .select_related('competition_event')
                .filter(competition_event__name=event_name)
                .order_by('-eng_notebook_score')
                )

          