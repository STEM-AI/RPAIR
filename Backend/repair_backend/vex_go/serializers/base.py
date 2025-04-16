from rest_framework import serializers
from rapair_db.models import EventGame
 
class GameScheduleSerializer(serializers.ModelSerializer):
    team1_name = serializers.CharField(source='team1.name', read_only=True)
    team2_name = serializers.CharField(source='team2.name', read_only=True)
    event_name = serializers.CharField(source='event.name', read_only=True)
    game_time = serializers.CharField(required = True , write_only = True)
    class Meta:
        model = EventGame
        fields = [
            'id',
            'team1',
            'team1_name',
            'team2',
            'team2_name',
            'stage',
            'event_name',
            'game_time',
            'time'
        ]
        extra_kwargs = {
            'stage': {'required': True},
            'team1':{'required': False},
            'team2':{'required': False},
            'time':{'required': False},
        }        


class GamesSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventGame
        fields = ['id','team1','team2', 'score','time_taken']
        read_only_fields = ['id', 'team1','team2']
        extra_kwargs = {
            'time_taken': {'required': False},
        }

    def validate(self, attrs):
        # Ensure that the score is a non-negative integer
        if 'score' in attrs:
            score = attrs['score']
            if not isinstance(score, int) or score < 0:
                raise serializers.ValidationError("Score must be a non-negative integer.")
        return attrs
    
