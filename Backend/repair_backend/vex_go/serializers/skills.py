from vex_go.serializers.base import GamesSerializer
from rest_framework import serializers
class GameSkillsSerializer(GamesSerializer):
    """
    Serializer for the GameSkills model.
    This serializer is used to create and update game skills records.
    """
    def update(self, instance, validated_data):
        # Update the instance with the validated data
        instance.score = validated_data.get('score', instance.score)
        print("instance score" , instance.score)
        instance.time_taken = validated_data.get('time_taken', instance.time_taken)
        print("instance.time",instance.time)
        if instance.stage == 'driver_go':
            print("driver score")
            instance.driver_score = instance.score
        elif instance.stage == 'coding':
            print("autonomous score")
            instance.autonomous_score = instance.score
        instance.operation = "set_skills_game_score"
        # Save the instance
        print("instance.operation" , instance.operation)
        instance.save()
        return instance

class SkillsTeamRankSerializer(serializers.Serializer):
    team__name = serializers.CharField()
    team = serializers.IntegerField()
    total_score = serializers.IntegerField()
    total_time_taken = serializers.FloatField()

    class Meta:
        fields = ['team','team_name','total_score','total_time_taken']