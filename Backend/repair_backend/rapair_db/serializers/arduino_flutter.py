from rapair_db.models import TeamCompetitionEvent
from rest_framework import serializers

class TeamCompetitionEventRankingSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name')
    class Meta:
        model = TeamCompetitionEvent
        fields = ['team', 'score','team_name']

class TeamCompetitionEventSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name')
    competition_event_name = serializers.CharField(source='competition_event.name')
    class Meta:
        model = TeamCompetitionEvent
        fields = ['team', 'competition_event', 'score','attachment','team_name','competition_event_name']

    def update(self, instance, validated_data):
        instance.score = validated_data.get('score', instance.score)
        if 'attachment' in validated_data:
            instance.attachment.delete(save=False)
            instance.attachment = validated_data.get('attachment', instance.attachment)
        instance.save()
        return instance