from rest_framework.generics import ListAPIView,UpdateAPIView
from rapair_db.models import EventGame
from rest_framework.permissions import AllowAny,IsAuthenticated
from programming.serializers import ProgrammingRankSerializer,ProgrammingGameSubmitSerializer
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

class ProgrammingGameSubmitView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProgrammingGameSubmitSerializer
    queryset = EventGame.objects.all()
    lookup_field = 'id'
    lookup_url_kwarg = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    