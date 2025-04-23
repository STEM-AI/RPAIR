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
from rest_framework.permissions import IsAuthenticated
from django.db.models.functions import Coalesce
from django.db.models.fields import FloatField




class GameCreateView(CreateAPIView):
    serializer_class = GameCreateSerializer
    queryset = EventGame.objects.all()
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        event_name = self.kwargs.get('event_name')
        if not event_name:
            return Response({"error": "Event name is required"}, status=status.HTTP_400_BAD_REQUEST)
        event = CompetitionEvent.objects.get(name=event_name)
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

    def get_queryset(self):
        event_name = self.kwargs.get('event_name')
        if not event_name:
            return SkillsTeamScore.objects.none()

        queryset = SkillsTeamScore.objects.filter(
            team__competition_event__name=event_name
        ).values('team').annotate(
            total_score=Sum('driver_score'),
            team_name=F('team__name')
        )

        queryset = queryset.annotate(
            total_time_taken=Coalesce(
                Subquery(
                    EventGame.objects
                    .filter(team1=OuterRef('team'), event__name=event_name)
                    .values('team1')
                    .annotate(total=Sum('time_taken'))
                    .values('total')[:1],
                    output_field=FloatField()
                ),
                Value(0, output_field=FloatField())
            )
        )

        return queryset.order_by('-total_score', 'total_time_taken')
