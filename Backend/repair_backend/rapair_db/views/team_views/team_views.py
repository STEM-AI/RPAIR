from rest_framework.views import APIView
from rest_framework.response import Response
from rapair_db.permissions import IsJudgeUser , IsSuperUser
from rest_framework import status
from rapair_db.serializers import TeamSerializer,TeamMinimalSerializer,EventGameSerializer,TeamCertificationSerializer
from rapair_db.models import Team ,EventGame
from rest_framework.generics import RetrieveAPIView, ListAPIView, RetrieveDestroyAPIView
from rest_framework.permissions import AllowAny
from django.db.models import Q
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend


class TeamListView(ListAPIView):
    permission_classes = [IsJudgeUser]
    serializer_class = TeamMinimalSerializer
    queryset = Team.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['competition_event__name','grade_level']
    search_fields = ['name']
        

class TeamRetrieveDestroyView(RetrieveDestroyAPIView):
    permission_classes = [IsSuperUser]
    serializer_class = TeamSerializer
    lookup_field = 'id'  # Lookup by team name instead of the default 'pk'

    def get_queryset(self):
        return (
            Team.objects
            .prefetch_related(
                'sponsors', 
                'social_media',
                'previous_competition',
                'coach',
                'members',
                'competition_event'
            )
            .select_related('organization')
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Team deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class TeamGamesListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = EventGameSerializer
    lookup_field = 'name'   
    lookup_url_kwarg = 'team_name'

    def get_queryset(self):
        team_name = self.kwargs.get('team_name')
        return (
            EventGame.objects
            .select_related('team1' , 'team2')
            .filter(Q(team1__name=team_name) | Q(team2__name=team_name))
            )


class TeamCertificationView(RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = TeamCertificationSerializer
    lookup_field = 'id'

    def get_queryset(self):
        return Team.objects.filter(id=self.kwargs.get('id'))
