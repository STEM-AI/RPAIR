from rest_framework import serializers
from ...models import SkillsTeamScore ,TeamCompetitionEvent

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


class SkillsRankSerializer(serializers.Serializer):
    team__name = serializers.CharField()
    team = serializers.IntegerField()
    total_score = serializers.IntegerField()

    class Meta:
        fields = ['team','team_name','total_score']

class TeamInterviewScoreSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='team.id',read_only=True)
    name = serializers.CharField(source='team.name',read_only=True)
    class Meta:
        model = TeamCompetitionEvent
        fields = ['id' , 'name' , 'interview_score']

class TeamEngNotebookScoreSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='team.id',read_only=True)
    name = serializers.CharField(source='team.name',read_only=True)
    class Meta:
        model = TeamCompetitionEvent
        fields = ['id' , 'name' , 'eng_notebook_score']