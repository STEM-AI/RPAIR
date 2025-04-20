from rest_framework import serializers


class SkillsTeamRankSerializer(serializers.Serializer):
    team__name = serializers.CharField()
    team = serializers.IntegerField()
    total_score = serializers.IntegerField()
    total_time_taken = serializers.FloatField()

    class Meta:
        fields = ['team','team_name','total_score','total_time_taken']