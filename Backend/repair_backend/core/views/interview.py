from rapair_db.models import Team,TeamCompetitionEvent
from rest_framework.generics import UpdateAPIView,ListAPIView
from core.serializers import TeamInterviewSerializer
from rapair_db.permissions import IsJudgeUser
from rest_framework.permissions import AllowAny


class TeamInterviewView(UpdateAPIView):
    queryset = TeamCompetitionEvent.objects.all()
    serializer_class = TeamInterviewSerializer
    permission_classes = [IsJudgeUser]
    lookup_field ='team_id'
    lookup_url_kwarg = 'id'

    def get_object(self):
        team_id = self.kwargs.get('id')
        event_id = self.kwargs.get('event_id')
        return TeamCompetitionEvent.objects.get(team_id=team_id,competition_event_id=event_id)



class TeamInterviewRankListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TeamInterviewSerializer
    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        if not event_id:
            return TeamCompetitionEvent.objects.none()
        return (
            TeamCompetitionEvent.objects
            .filter(competition_event__id=event_id)
            .select_related(
                'team',
                'competition_event'
            )
            .order_by('-interview_score')
            )