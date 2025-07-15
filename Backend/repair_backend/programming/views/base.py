from rest_framework.generics import ListAPIView
from rapair_db.models import EventGame
from rest_framework.permissions import AllowAny
from programming.serializers import ProgrammingRankSerializer
import logging
logger = logging.getLogger(__name__)


class ProgrammingRankListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProgrammingRankSerializer
    queryset = EventGame.objects.all()
    lookup_field = 'event_id'
    lookup_url_kwarg = 'event_id'

    def get_queryset(self):
        logger.info(f"event_id {self.kwargs.get('event_id')}")
        return self.queryset.filter(event_id=self.kwargs.get('event_id'),stage='programming').order_by('-score')