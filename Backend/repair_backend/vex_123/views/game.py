from core.views import GameSkillsView
from vex_123.serializers import GameSerializer
from core.serializers import SkillsTeamRankSerializer
from rapair_db.models import SkillsTeamScore
from rapair_db.models import EventGame
from django.db.models import Subquery, OuterRef, FloatField,F
from rest_framework.generics import ListAPIView

class Vex123GameView(GameSkillsView):
    serializer_class = GameSerializer

class Vex123RankView(ListAPIView):
    serializer_class = SkillsTeamRankSerializer
    queryset = SkillsTeamScore.objects.all()

def get_queryset(self):
    queryset = super().get_queryset()
    # Get the event name from the URL parameters
    event_name = self.kwargs.get('event_name')
    if not event_name:
        return SkillsTeamScore.objects.none()
    # Subquery to get time_taken for the team in the given event
    time_taken_subquery = (
        EventGame.objects
        .filter(team1=OuterRef('team'), event__name=event_name)
        .values('time_taken')[:1]  # Directly fetch time_taken
    )
    # Filter the queryset based on the event name
    queryset = queryset.filter(team__competition_event__name=event_name)
    # Annotate the queryset with driver_score and time_taken
    queryset = queryset.annotate(
        total_score=F('driver_score'),  # Use only driver_score
        time_taken=Subquery(time_taken_subquery, output_field=FloatField())
    )
    # Order the queryset by total_score and time_taken
    queryset = queryset.order_by('-total_score', 'time_taken')
    return queryset
