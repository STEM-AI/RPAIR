from rest_framework.generics import UpdateAPIView
from rapair_db.models import EventGame
from vex_go.serializers import GameSkillsSerializer
from rapair_db.permissions import IsJudgeUser


class GameSkillsView(UpdateAPIView):
    """
    View to handle the set of game skills scores.
    """
    queryset = EventGame.objects.all()
    serializer_class = GameSkillsSerializer
    permission_classes = [IsJudgeUser]
    lookup_field ='id'