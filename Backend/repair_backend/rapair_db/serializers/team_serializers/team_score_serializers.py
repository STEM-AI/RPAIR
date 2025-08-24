from rest_framework import serializers
from ...models import SkillsTeamScore ,TeamCompetitionEvent

class SkillsTeamScoreSerializer(serializers.Serializer):
    team_name = serializers.SerializerMethodField()
    team_number = serializers.CharField(source='team.team_number',read_only=True)
    class Meta:
        model = SkillsTeamScore
        fields = ['team_name','driver_score','autonomous_score','team_number']

    def get_team_name(self, obj):
        return obj.team.name

class TeamScoreSerializer(serializers.Serializer):
    team__name = serializers.CharField()
    team_number = serializers.CharField()
    team = serializers.IntegerField()
    avg_score = serializers.IntegerField()

    class Meta:
        fields = ['team','team_name','avg_score','team_number']


class SkillsRankSerializer(serializers.Serializer):
    team__name = serializers.CharField()
    team = serializers.IntegerField()
    total_score = serializers.IntegerField()
    team_number = serializers.CharField()
    class Meta:
        fields = ['team','team_name','total_score','team_number']

class TeamInterviewScoreSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='team.id',read_only=True)
    name = serializers.CharField(source='team.name',read_only=True)
    team_number = serializers.CharField(source='team.team_number',read_only=True)
    class Meta:
        model = TeamCompetitionEvent
        fields = ['id' , 'name' , 'interview_score','team_number']

class TeamEngNotebookScoreSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='team.id',read_only=True)
    name = serializers.CharField(source='team.name',read_only=True)
    team_number = serializers.CharField(source='team.team_number',read_only=True)
    class Meta:
        model = TeamCompetitionEvent
        fields = ['id' , 'name' , 'eng_notebook_score','team_number']