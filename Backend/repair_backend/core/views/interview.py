from rapair_db.models import Team,TeamCompetitionEvent
from rest_framework.generics import UpdateAPIView,ListAPIView
from core.serializers import TeamInterviewSerializer
from rapair_db.permissions import IsJudgeUser
from rest_framework.permissions import AllowAny


class TeamInterviewView(UpdateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamInterviewSerializer
    permission_classes = [IsJudgeUser]
    lookup_field ='id'



class TeamInterviewRankListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TeamInterviewSerializer
    def get_queryset(self):
        event_name = self.kwargs.get('event_name')
        if not event_name:
            return TeamCompetitionEvent.objects.none()
        return (
            TeamCompetitionEvent.objects
            .select_related('competition_event')
            .filter(competition_event__name=event_name)
            .order_by('-interview_score')
            )