from rest_framework import serializers
from ...models import SkillsTeamScore

class SkillsTeamScoreSerializer(serializers.Serializer):
    team_name = serializers.SerializerMethodField()
    class Meta:
        model = SkillsTeamScore
        fields = ['team_name','driver_score','autonomous_score']

    def get_team_name(self, obj):
        return obj.team.name