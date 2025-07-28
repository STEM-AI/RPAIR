from rest_framework.generics import UpdateAPIView,ListAPIView
from rapair_db.models import EventGame,TeamworkTeamScore
from vex_go.serializers import GameCoopSerializer,CoopTeamRankSerializer
from rapair_db.permissions import IsJudgeUser
from rest_framework.permissions import AllowAny
from django.db.models import Avg
from rest_framework.response import Response
from rapair_db.models import TeamCompetitionEvent
import logging
logger = logging.getLogger(__name__)

class GameCoopView(UpdateAPIView):
    """
    View to handle the set of game coop scores.
    """
    queryset = EventGame.objects.all()
    serializer_class = GameCoopSerializer
    permission_classes = [IsJudgeUser]
    lookup_field = 'id'

class CoopRankView(ListAPIView):
    """
    View to handle the ranking of game coop scores.
    """
    permission_classes=[AllowAny]
    serializer_class = CoopTeamRankSerializer
    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        logger.info(f"event id {event_id}")
        if not event_id:
            return TeamworkTeamScore.objects.none()

        queryset = (
            TeamworkTeamScore.objects
            .filter(game__event_id=event_id)  # Only scores from games in this event
            .select_related('team')  # Fetch the related Team model
            .values('team', 'team__name')  # Include team name directly
            .annotate(avg_score=Avg('score'))
            .order_by('-avg_score')
            )
        logger.info(f"queryset {queryset}")
        return queryset         
    
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