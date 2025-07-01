from rest_framework import serializers
from rapair_db.models import TeamCompetitionEvent
import logging
logger = logging.getLogger(__name__)

class TeamInterviewSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='team.id',read_only=True)
    name = serializers.CharField(source='team.name',read_only=True)
    class Meta:
        model = TeamCompetitionEvent
        fields = ['interview_score','id','name']

        extra_kwargs = {
            'name': {'required': False},
            'interview_score': {'required': True},
            'id': {'required': True}
        }

    def update(self, instance, validated_data):
        # Update the instance with the validated data
        instance.interview_score = validated_data.get('interview_score', instance.interview_score)
        logger.info(f"Updating interview score for team {instance.team.name} to {instance.interview_score}")
        instance.save()
        return instance