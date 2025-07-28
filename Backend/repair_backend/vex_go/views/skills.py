from rest_framework.generics import UpdateAPIView,ListAPIView
from rapair_db.models import EventGame,SkillsTeamScore
from vex_go.serializers import GameSkillsSerializer
from core.serializers import SkillsTeamRankSerializer
from rapair_db.permissions import IsJudgeUser
from django.db.models import Max, Subquery, OuterRef, FloatField,Sum,F
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rapair_db.models import TeamCompetitionEvent

class GameSkillsView(UpdateAPIView):
    """
    View to handle the set of game skills scores.
    """
    queryset = EventGame.objects.all()
    serializer_class = GameSkillsSerializer
    permission_classes = [IsJudgeUser]
    lookup_field ='id'



class SkillsRankView(ListAPIView):
    """
    View to rank teams based on the sum of their highest game skills score for a given event.
    If two teams have the same total score, rank them by the sum of their time_taken in all games where they are team1.
    """
    serializer_class = SkillsTeamRankSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        if not event_id:
            return SkillsTeamScore.objects.none()

        # Subquery to get total time_taken per team (as team1) in the given event
        total_time_subquery = (
            EventGame.objects
            .filter(team1=OuterRef('team'), event__id=event_id)
            .values('team1')  # Group by team1
            .annotate(total_time=Sum('time_taken'))
            .values('total_time')[:1]
        )

        return (
            SkillsTeamScore.objects
            .filter(game__event_id=event_id)  # Only scores from games in this event
            .values('team', 'team__name')
            .annotate(
                total_score=Max('autonomous_score') + Max('driver_score'),
                team_name=F('team__name'),
                total_time_taken=Subquery(total_time_subquery, output_field=FloatField())
            )
            .order_by('-total_score', 'total_time_taken')
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
