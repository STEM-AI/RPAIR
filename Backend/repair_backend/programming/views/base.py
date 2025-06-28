from rest_framework.generics import RetrieveAPIView,ListAPIView
from rapair_db.models import EventGame
from rest_framework.permissions import IsAuthenticated
from rapair_db.serializers import EventGameSerializer
from programming.serializers import ProgrammingRankSerializer


class ProgrammingGameIDRetrieveView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EventGameSerializer
    queryset = EventGame.objects.all()
    lookup_field = 'team1'
    lookup_url_kwarg = 'team_id'

    def get_object(self):
        return self.queryset.filter(event=self.kwargs.get("event_id"),stage=self.kwargs.get("stage")).last()


class ProgrammingRankListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProgrammingRankSerializer
    queryset = EventGame.objects.all()
    lookup_field = 'event'
    lookup_url_kwarg = 'event_id'

    def get_queryset(self):
        return self.queryset.filter(stage='programming').order_by('-socre')