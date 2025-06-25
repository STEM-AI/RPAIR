from core.models import Schedule
from rest_framework import serializers


class ScheduleSerializer(serializers.ModelSerializer):
    event_name = serializers.CharField(source='event.name', read_only=True)
    stage = serializers.CharField(read_only=True)

    class Meta:
        model = Schedule
        fields = ['id', 'event_name', 'time', 'stage']
        read_only_fields = ['id', 'event_name', 'stage']
        extra_kwargs = {
            'event': {'required': False},
            'time': {'required': False},
            'stage': {'required': False},
        }

class ScheduleDetailSerializer(serializers.ModelSerializer):
    event_name = serializers.CharField(source='event.name', read_only=True)
    stage = serializers.CharField(read_only=True)
    games = serializers.SerializerMethodField()
    
    class Meta:
        model = Schedule
        fields = ['id', 'event_name', 'time', 'stage', 'games']
        read_only_fields = ['id', 'event_name', 'stage']
        extra_kwargs = {
            'event': {'required': False},
            'time': {'required': False},
            'stage': {'required': False},
        }

    def get_games(self, obj):
        from core.serializers.game import GameScheduleSerializer
        games = obj.eventgame_set.all()
        return GameScheduleSerializer(games, many=True).data
    def validate(self, attrs):
        # Ensure that the stage is one of the allowed choices
        allowed_stages = [
            'teamwork', 'driver_iq', 'driver_go', 'auto',
            'coop', 'coding', 'final', 'vex_123', 'programming'
        ]
        if attrs.get('stage') not in allowed_stages:
            raise serializers.ValidationError("Invalid stage choice.")
        return attrs

    