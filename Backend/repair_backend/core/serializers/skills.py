from rest_framework import serializers
from rapair_db.models import Team


class SkillsTeamRankSerializer(serializers.Serializer):
    team = serializers.IntegerField()
    team_name = serializers.CharField()
    total_score = serializers.IntegerField()
    total_time_taken = serializers.FloatField()

    class Meta:
        fields = ['team', 'team_name', 'total_score', 'total_time_taken']