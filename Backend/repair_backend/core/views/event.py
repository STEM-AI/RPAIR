from rest_framework.generics import UpdateAPIView
from core.serializers.event import CompetitionEventSerializer
from rapair_db.models import CompetitionEvent
from rapair_db.permissions import IsJudgeUser

class UpdateEventTimeLimit(UpdateAPIView):
    serializer_class = CompetitionEventSerializer
    permission_classes = [IsJudgeUser]
    lookup_field = 'id'

    def get_queryset(self):
        return CompetitionEvent.objects.filter(id=self.kwargs['id'])
    
    