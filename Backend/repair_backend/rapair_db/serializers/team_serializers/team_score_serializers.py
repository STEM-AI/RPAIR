from rest_framework import serializers
from ...models import SkillsTeamScore , Team

class SkillsTeamScoreSerializer(serializers.Serializer):
    team_name = serializers.SerializerMethodField()
    class Meta:
        model = SkillsTeamScore
        fields = ['team_name','driver_score','autonomous_score']

    def get_team_name(self, obj):
        return obj.team.name
    
class TeamScoreSerializer(serializers.Serializer):
    team__name = serializers.CharField()
    team = serializers.IntegerField()
    avg_score = serializers.IntegerField()

    class Meta:
        fields = ['team','team_name','avg_score']

class TeamInterviewScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id' , 'name' , 'interview_score']

class TeamEngNotebookScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id' , 'name' , 'eng_notebook_score']