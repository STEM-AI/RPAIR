from rest_framework.generics import ListAPIView,UpdateAPIView
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rapair_db.serializers.arduino_flutter import TeamCompetitionEventSerializer,TeamCompetitionEventRankingSerializer,TeamCompetitionEventScoreSerializer
from rapair_db.models import TeamCompetitionEvent
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_spectacular.utils import extend_schema
from rapair_db.permissions import IsJudgeUser
class TeamAttachmentListView(ListAPIView):
    serializer_class = TeamCompetitionEventSerializer   
    queryset = TeamCompetitionEvent.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TeamCompetitionEvent.objects.filter(competition_event__id=self.kwargs['event_id'])


@extend_schema(
    request={
        'multipart/form-data': {
            'type': 'object',
            'properties': {
                'score': {'type': 'number'},
                'attachment': {'type': 'string', 'format': 'binary'},
            }
        }
    },
    responses={200: TeamCompetitionEventSerializer}
)
class TeamAttachmentUpdateView(UpdateAPIView):
    serializer_class = TeamCompetitionEventSerializer
    queryset = TeamCompetitionEvent.objects.all()
    parser_classes = [MultiPartParser, FormParser,JSONParser]
    permission_classes = [IsAuthenticated]
    lookup_field = 'team_id'
    lookup_url_kwarg = 'team_id'

    def get_queryset(self):
        return TeamCompetitionEvent.objects.filter(team_id=self.kwargs['team_id'],competition_event__id=self.kwargs['event_id'])
    
class TeamAttachmentRankingView(ListAPIView):
    serializer_class = TeamCompetitionEventRankingSerializer
    queryset = TeamCompetitionEvent.objects.all()
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = TeamCompetitionEvent.objects.filter(competition_event__id=self.kwargs['event_id'])
        return queryset.order_by('-score')
    
class TeamScoreUpdateView(UpdateAPIView):
    serializer_class = TeamCompetitionEventScoreSerializer
    queryset = TeamCompetitionEvent.objects.all()
    permission_classes = [IsJudgeUser]
    lookup_field = 'team_id'
    lookup_url_kwarg = 'team_id'

    def get_queryset(self):
        return TeamCompetitionEvent.objects.filter(team_id=self.kwargs['team_id'],competition_event__id=self.kwargs['event_id'])
    
class TeamAttachmentScoreListView(ListAPIView):
    serializer_class = TeamCompetitionEventScoreSerializer
    queryset = TeamCompetitionEvent.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TeamCompetitionEvent.objects.filter(competition_event__id=self.kwargs['event_id']).order_by('-score')
