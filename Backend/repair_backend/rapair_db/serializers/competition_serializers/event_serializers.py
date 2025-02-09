from rest_framework import serializers
from ...models import CompetitionEvent , Team , EventGame , TeamworkTeamScore
from ..team_serializers.team_member_serializers import TeamMemberSerializer
from ..team_serializers.team_score_serializers import TeamworkScoreSerializer
from django.db.models import Avg
from drf_spectacular.utils import extend_schema_field


class TeamCompetitionProfileSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(many=True)
    class Meta:
        model = Team
        fields = ['name','robot_name','type','members' , 'team_leader_name' ]

class EventSerializer(serializers.ModelSerializer):
    teams = TeamCompetitionProfileSerializer(many=True , required=False)
    class Meta:
        model = CompetitionEvent
        fields = ['start_date', 'end_date', 'location' , 'teams'  , 'fees' , 'age' , 'category']

        extra_kwargs = {
            'teams': {'read_only': True},
        }

class EventGameSerializer(serializers.ModelSerializer):
    team1 = serializers.StringRelatedField()
    team2 = serializers.StringRelatedField()

    class Meta:
        model = EventGame
        fields = ['id' ,'team1', 'team2', 'score' , 'stage']


class EventListSerializer(serializers.ModelSerializer):
    top3_teams = serializers.SerializerMethodField(read_only = True)
    class Meta:
        model = CompetitionEvent
        fields = ['id' ,'name', 'start_date', 'end_date', 'location' , 'top3_teams']

    @extend_schema_field(serializers.ListField(child=serializers.DictField()))
    def get_top3_teams(self, obj):
        top3_teams = (
                TeamworkTeamScore.objects
                .select_related('team' , 'team_competition_event')  # Fetch the related Team model
                .filter(team__competition_event=obj)
                .values('team', 'team__name')  # Include team name directly
                .annotate(avg_score=Avg('score'))
                .order_by('-avg_score')[:3]
                )
        serializers = TeamworkScoreSerializer(top3_teams , many = True)
        return serializers.data