from core.serializers import GamesSerializer
from rapair_db.models import EventGame
from rest_framework import serializers
import logging
logger = logging.getLogger(__name__)

class GameCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventGame
        fields = ['id','event', 'team1', 'time', 'stage', 'paused_time']
        read_only_fields = ['event','paused_time','stage']

    def create(self, validated_data):
        validated_data['paused_time'] = 300
        validated_data['duration'] = 300
        validated_data['stage'] = self.context['stage']
        return super().create(validated_data)


class GameSerializer(GamesSerializer):
    """
    Serializer for the GameSkills model.
    This serializer is used to create and update game skills records.
    """
    def update(self, instance, validated_data):
        # Update the instance with the validated data
        instance.score = validated_data.get('score', instance.score)
        logger.info("instance score" , instance.score)
        instance.time_taken = validated_data.get('time_taken', instance.time_taken)
        logger.info("instance.time",instance.time)
        if instance.stage in ['vex_123','vex_123_manual','vex_123_coder_card','vex_123_programming']:
            logger.info("driver score")
            instance.driver_score = instance.score

        instance.operation = "set_skills_game_score"
        instance.completed = True
        # Save the instance
        logger.info("instance.operation" , instance.operation)
        instance.save()
        return instance