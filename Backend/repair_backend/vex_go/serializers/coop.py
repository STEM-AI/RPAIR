from core.serializers import GamesSerializer
from rest_framework import serializers
class GameCoopSerializer(GamesSerializer):
    """
    Serializer for the GameCoop model.
    This serializer is used to create and update game coop records.
    """
    def update(self, instance, validated_data):
        # Update the instance with the validated data
        instance.score = validated_data.get('score', instance.score)
        instance.operation = "set_teamwork_game_score"
        # Save the instance
        instance.save()
        return instance
    
class CoopTeamRankSerializer(serializers.Serializer):
    team__name = serializers.CharField()
    team = serializers.IntegerField()
    avg_score = serializers.IntegerField()

    class Meta:
        fields = ['team','team_name','avg_score']