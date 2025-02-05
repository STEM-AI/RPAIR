from rest_framework import serializers
from ...models import SkillsTeamScore , TeamworkTeamScore

class SkillsTeamScoreSerializer(serializers.Serializer):
    team_name = serializers.SerializerMethodField()
    class Meta:
        model = SkillsTeamScore
        fields = ['team_name','driver_score','autonomous_score']

    def get_team_name(self, obj):
        return obj.team.name
    
class TeamworkScoreSerializer(serializers.Serializer):
    team__name = serializers.CharField()
    team = serializers.IntegerField(write_only=True)
    avg_score = serializers.IntegerField()
    class Meta:
        model = TeamworkTeamScore
        fields = ['team','team_name','avg_score']