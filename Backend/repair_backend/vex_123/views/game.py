from core.views import GameSkillsView
from vex_123.serializers import GameSerializer
from core.serializers import SkillsTeamRankSerializer
from rapair_db.models import SkillsTeamScore
from rapair_db.models import EventGame,CompetitionEvent
from django.db.models import Subquery, OuterRef,F,Sum,Value
from rest_framework.generics import ListAPIView
from vex_123.serializers import GameCreateSerializer
from rest_framework.generics import CreateAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.db.models.functions import Coalesce
from django.db.models.fields import FloatField
from rapair_db.models import TeamCompetitionEvent



class GameCreateView(CreateAPIView):
    serializer_class = GameCreateSerializer
    queryset = EventGame.objects.all()
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        event_id = self.kwargs.get('event_id')
        if not event_id:
            return Response({"error": "Event id is required"}, status=status.HTTP_400_BAD_REQUEST)
        event = CompetitionEvent.objects.get(id=event_id)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(event=event)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class Vex123GameView(GameSkillsView):
    serializer_class = GameSerializer
    permission_classes = [IsAuthenticated]

class Vex123RankView(ListAPIView):
    serializer_class = SkillsTeamRankSerializer
    queryset = SkillsTeamScore.objects.all()
    permission_classes = [AllowAny]

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        if not event_id:
            return SkillsTeamScore.objects.none()

        queryset = (
            SkillsTeamScore.objects
            .filter(game__event_id=event_id)  # Only scores from games in this event
            .values('team', 'team__name')
            .annotate(
                total_score=Sum('driver_score'),
                team_name=F('team__name')
            )
        )
        # Subquery to get total time_taken per team (as team1) in the given event
        total_time_subquery = (
            EventGame.objects
            .filter(team1=OuterRef('team'), event__id=event_id)
            .values('team1')  # Group by team1
            .annotate(total_time=Sum('time_taken'))
            .values('total_time')[:1]
        )

        queryset = queryset.annotate(
            total_time_taken=Coalesce(
                Subquery(total_time_subquery, output_field=FloatField()),
                Value(0, output_field=FloatField())
            )
        )

        return queryset.order_by('-total_score', 'total_time_taken')


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
