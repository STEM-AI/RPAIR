from rest_framework.generics import ListAPIView , CreateAPIView
from ...models import JudgeForCompetitionEvent,CompetitionEvent
from...serializers import JudgeForCompetitionEventSerializer , JudgeEventListSerializer
from ...permissions import IsSuperUser,IsJudgeUser


class JudgeForCompetitionEventCreateView(CreateAPIView):
    queryset = JudgeForCompetitionEvent.objects.all()
    serializer_class = JudgeForCompetitionEventSerializer
    permission_classes = [IsSuperUser]

    def perform_create(self, serializer):
        competition_event = self.kwargs.get('competition_event')
        competition_event = CompetitionEvent.objects.get(id=competition_event)
        serializer.save(competition_event=competition_event)


class JudgeForCompetitionEventListView(ListAPIView):
    serializer_class = JudgeEventListSerializer
    permission_classes = [IsJudgeUser]

    def get_queryset(self):
        judge = self.request.user  # Assumes the user is authenticated
        return JudgeForCompetitionEvent.objects.filter(user=judge)
