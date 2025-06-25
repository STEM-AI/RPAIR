from rest_framework import serializers
from rapair_db.models import EventGame
from core.models import Schedule
import logging
logger = logging.getLogger(__name__)
class GamesSerializer(serializers.ModelSerializer):
    team1_name = serializers.CharField(source='team1.name', read_only=True) 
    team2_name = serializers.CharField(source='team2.name', read_only=True)
    class Meta:
        model = EventGame
        fields = ['id','team1','team2', 'score','time_taken','team1_name','team2_name']
        read_only_fields = ['id', 'team1','team2','team1_name','team2_name']
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
    
 
class GameScheduleSerializer(serializers.ModelSerializer):
    team1_name = serializers.CharField(source='team1.name', read_only=True)
    team2_name = serializers.CharField(source='team2.name', read_only=True)
    event_name = serializers.CharField(source='event.name', read_only=True)
    game_time = serializers.CharField(required = True , write_only = True)
    stage = serializers.ChoiceField(choices=[
        ('teamwork', 'Teamwork'),
        ('driver_iq', 'Driver IQ'),
        ('driver_go', 'Driver Go'),
        ('auto','Auto'),
        ('coop', 'Teamwork Coop'),
        ('coding', 'Coding'),
        ('final', 'Teamwork Final'),
        ('vex_123', 'VEX 123'),
        ('programming', 'Programming'),
    ])
    class Meta:
        model = EventGame
        fields = ['id','team1','team1_name','team2','team2_name','stage','event_name','game_time','time','score']
        extra_kwargs = {
            'stage': {'required': True},
            'team1':{'required': False},
            'team2':{'required': False},
            'time':{'required': False},
            'score':{'read_only': True},
        }

    def create(self, validated_data):
        from core.utils import create_schedule
        from rapair_db.models import CompetitionEvent
        from rest_framework.exceptions import ValidationError
        from django.db import transaction

        event_name = self.context['view'].kwargs.get('event_name')
        logger.info(f"event_name :{event_name}")    
        if not event_name:
            raise ValidationError("Event name is required")

        stage = validated_data.get('stage')
        from datetime import datetime

        time_str = validated_data.get('game_time')
        try:
            time = datetime.strptime(time_str, "%H:%M")
        except ValueError:
            raise ValidationError("Time must be in HH:MM format")

        if not stage:
            raise ValidationError("Stage is required")
        if not time:
            raise ValidationError("Time is required")

        try:
            with transaction.atomic():
                # Create the schedule and event games
                event = CompetitionEvent.objects.get(name=event_name)
                logger.info(f"event :{event}")
                schedule = Schedule.objects.create(
                    event=event,
                    time=time,
                    stage=stage
                )
                logger.info(f"schedule :{schedule}")
                event_games = create_schedule(event=event, stage=stage, time=time_str, schedule=schedule)
                logger.info(f"event_games :{event_games}")
                if isinstance(event_games, list):
                    return event_games
                return [event_games]

        except CompetitionEvent.DoesNotExist:
            raise ValidationError("Event does not exist")
        except Exception as e:
            raise ValidationError(f"An error occurred: {str(e)}")