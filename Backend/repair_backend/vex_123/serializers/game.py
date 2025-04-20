from core.serializers import GamesSerializer

class GameSerializer(GamesSerializer):
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
        if instance.stage == 'vex_123':
            print("driver score")
            instance.driver_score = instance.score

        instance.operation = "set_skills_game_score"
        # Save the instance
        print("instance.operation" , instance.operation)
        instance.save()
        return instance