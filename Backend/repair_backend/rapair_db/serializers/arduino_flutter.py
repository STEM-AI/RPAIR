from rapair_db.models import TeamCompetitionEvent
from rest_framework import serializers

class TeamCompetitionEventRankingSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name')
    class Meta:
        model = TeamCompetitionEvent
        fields = ['team', 'score','team_name']

class TeamCompetitionEventScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamCompetitionEvent
        fields = ['team', 'score']

class TeamCompetitionEventSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name')
    competition_event_name = serializers.CharField(source='competition_event.name')
    class Meta:
        model = TeamCompetitionEvent
        fields = ['team', 'competition_event','attachment','team_name','competition_event_name']

    def update(self, instance, validated_data):
        if 'attachment' in validated_data:
            instance.attachment.delete(save=False)
            instance.attachment = validated_data.get('attachment', instance.attachment)
        instance.save()
        return instance