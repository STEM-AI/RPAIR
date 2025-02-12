from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...permissions import IsJudgeUser
from ...utils import event_utils
from ...models import EventGame , Team ,  TeamworkTeamScore , SkillsTeamScore
from ...serializers import EventGameSerializer
from rest_framework.permissions import AllowAny
from django.db import IntegrityError
from django.db.models import Avg
from ...serializers import TeamScoreSerializer , TeamInterviewScoreSerializer , TeamEngNotebookScoreSerializer
from rest_framework.generics import ListAPIView 


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
                
    
class TeamWorkRankView(ListAPIView):
    '''Rank teams based on Average of thier Teamwork Score For Event'''
    permission_classes = [IsJudgeUser]
    serializer_class = TeamScoreSerializer
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
    def list(self, request, *args, **kwargs):
        # Get the queryset
        queryset = self.get_queryset()

        # Serialize the data
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        # Save the rank to the Team model
        for index, item in enumerate(data):
            team = Team.objects.get(id=item['team'])
            team.teamwork_rank = index + 1  # Rank starts from 1
            team.save()

        # Return the response
        return Response(data)
    
        
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
    
class SkillsRankView(ListAPIView):
    '''Rank teams based on Average of thier Skills Score For Event'''
    permission_classes = [IsJudgeUser]
    serializer_class = TeamScoreSerializer
    def get_queryset(self):
        event_name = self.kwargs.get('event_name')
        if not event_name:
            return SkillsTeamScore.objects.none()
        return (
                SkillsTeamScore.objects
                .filter(team__competition_event__name=event_name)  # Filter by event name
                .select_related('team')  # Fetch the related Team model
                .values('team', 'team__name')  # Include team name directly
                .annotate(avg_score=Avg('autonomous_score') + Avg('driver_score'))
                .order_by('-avg_score')
                )
    
    def list(self, request, *args, **kwargs):
        # Get the queryset
        queryset = self.get_queryset()

        # Serialize the data
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        # Save the rank to the Team model
        for index, item in enumerate(data):
            team = Team.objects.get(id=item['team'])
            team.skills_rank = index + 1  # Rank starts from 1
            team.save()

        # Return the response
        return Response(data)
    



          