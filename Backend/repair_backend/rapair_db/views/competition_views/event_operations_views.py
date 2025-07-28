from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...permissions import IsJudgeUser
from core.utils import event_utils
from ...models import EventGame , Team ,  TeamworkTeamScore , SkillsTeamScore , TeamCompetitionEvent
from ...serializers import EventGameSerializer
from rest_framework.permissions import AllowAny
from django.db import IntegrityError
from django.db.models import Avg,Max
from ...serializers import TeamScoreSerializer,TeamInterviewScoreSerializer,TeamEngNotebookScoreSerializer,SkillsRankSerializer
from rest_framework.generics import ListAPIView 
from django_filters.rest_framework import DjangoFilterBackend


class CreateScheduleEventGameView(APIView):
    permission_classes = [AllowAny]
    serializer_class = EventGameSerializer

    def post(self, request , event_id=None):
        if not event_id:
            return Response({"error": "Event id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        event = event_utils.get_object(event_id=event_id)
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
    queryset =  EventGame.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['stage']

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        if not event_id:
            return EventGame.objects.none()
        event = event_utils.get_object(event_id=event_id)
        return EventGame.objects.filter(event=event).order_by('time')
                
    
class TeamWorkRankView(ListAPIView):
    '''Rank teams based on Average of thier Teamwork Score For Event'''
    permission_classes = [AllowAny]
    serializer_class = TeamScoreSerializer
    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        if not event_id:
            return TeamworkTeamScore.objects.none()
        return (
                TeamworkTeamScore.objects
                .filter(game__event_id=event_id)  # Only scores from games in this event
                .select_related('team')  # Fetch the related Team model
                .values('team', 'team__name')  # Include team name directly
                .annotate(avg_score=Avg('score'))
                .order_by('-avg_score')
                )
    def list(self, request, *args, **kwargs):
        # Get the queryset
        queryset = self.get_queryset()
        event_id = self.kwargs.get('event_id')

        # Serialize the data
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        # Save the rank to the Team model
        for index, item in enumerate(data):
            team = TeamCompetitionEvent.objects.get(team_id=item['team'],competition_event_id=event_id)
            team.teamwork_rank = index + 1  # Rank starts from 1
            team.save()

        # Return the response
        return Response(data)
    
        
class TeamsInterviewScoreRankView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TeamInterviewScoreSerializer
    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        if not event_id:
            return TeamCompetitionEvent.objects.none()
        return (
                TeamCompetitionEvent.objects
                .filter(competition_event__id=event_id)
                .select_related(
                    'team',
                    'competition_event'
                )
                .order_by('-interview_score')
                )

class TeamsEngNotebookScoreRank(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TeamEngNotebookScoreSerializer
    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        if not event_id:
            return TeamCompetitionEvent.objects.none()
        return (TeamCompetitionEvent.objects
                .filter(competition_event__id=event_id)
                .select_related(
                    'team',
                    'competition_event'
                )
                .order_by('-eng_notebook_score')
                )
    
class SkillsRankView(ListAPIView):
    '''Rank teams based on the sum of the highest autonomous_score and highest driver_score for each team'''
    permission_classes = [AllowAny]
    serializer_class = SkillsRankSerializer

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        if not event_id:
            return SkillsTeamScore.objects.none()
        return (
            SkillsTeamScore.objects
            .filter(game__event_id=event_id)  # Only scores from games in this event
            .select_related('team')  # Fetch the related Team model
            .values('team', 'team__name')  # Include team name directly
            .annotate(
                total_score=Max('autonomous_score') + Max('driver_score')
            )
            .order_by('-total_score')
        )

    def list(self, request, *args, **kwargs):
        # Get the queryset
        queryset = self.get_queryset()
        event_id = self.kwargs.get('event_id')

        # Serialize the data
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        # Save the rank to the Team model
        for index, item in enumerate(data):
            team = TeamCompetitionEvent.objects.get(team_id=item['team'],competition_event_id=event_id)
            team.skills_rank = index + 1  # Rank starts from 1
            team.save()

        # Return the response
        return Response(data)
    



          