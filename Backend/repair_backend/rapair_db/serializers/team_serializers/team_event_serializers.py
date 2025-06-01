from rest_framework import serializers
from rapair_db.models import TeamCompetitionEvent,Team
import logging
logger = logging.getLogger(__name__)
class TeamNonTechScoreSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='team.id',read_only=True)
    name = serializers.CharField(source='team.name',read_only=True)
    class Meta:
        model = TeamCompetitionEvent
        fields = ['id','name','eng_notebook_score','interview_score','inspect_score']

class UserTeamCompetitionEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamCompetitionEvent
        fields = ['id','team','competition_event']
        extra_kwargs = {
            'team': {'required': False, 'read_only': True},
            'competition_event': {'required': True}
        }

    def create(self, validated_data):
        team = Team.objects.get(id=self.context['id'])
        validated_data['team'] = team
        return super().create(validated_data)

