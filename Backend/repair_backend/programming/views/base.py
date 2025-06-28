from rest_framework.generics import ListAPIView
from rapair_db.models import EventGame
from rest_framework.permissions import IsAuthenticated
from programming.serializers import ProgrammingRankSerializer



class ProgrammingRankListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProgrammingRankSerializer
    queryset = EventGame.objects.all()
    lookup_field = 'event'
    lookup_url_kwarg = 'event_id'

    def get_queryset(self):
        return self.queryset.filter(stage='programming').order_by('-socre')