from rest_framework.generics import ListAPIView , CreateAPIView
from ...models import JudgeForCompetitionEvent
from...serializers import JudgeForCompetitionEventSerializer , JudgeEventListSerializer
from ...permissions import IsSuperUser
from rest_framework.permissions import AllowAny


class JudgeForCompetitionEventCreateView(CreateAPIView):
    queryset = JudgeForCompetitionEvent.objects.all()
    serializer_class = JudgeForCompetitionEventSerializer
    permission_classes = [AllowAny]



class JudgeForCompetitionEventListView(ListAPIView):
    serializer_class = JudgeEventListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        judge = self.request.user  # Assumes the user is authenticated
        return JudgeForCompetitionEvent.objects.filter(user=judge)
