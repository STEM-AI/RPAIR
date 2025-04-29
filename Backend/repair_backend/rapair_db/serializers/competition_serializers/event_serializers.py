from rest_framework import serializers
from ...models import CompetitionEvent , Team , EventGame , TeamworkTeamScore
from ..team_serializers.team_member_serializers import TeamMemberSerializer
from ..team_serializers.team_score_serializers import TeamScoreSerializer
from django.db.models import Avg
from drf_spectacular.utils import extend_schema_field


class TeamCompetitionProfileSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(many=True)
    class Meta:
        model = Team
        fields = ['name','robot_name','type','members' , 'team_leader_name' ]

class EventSerializer(serializers.ModelSerializer):
    teams = TeamCompetitionProfileSerializer(many=True , required=False,read_only=True)
    competition_name = serializers.CharField(source='competition.name',read_only=True)
    class Meta:
        model = CompetitionEvent
        fields = ['id','name','start_date', 'end_date', 'location' , 'teams'  , 'fees' , 'age' , 'category' , 'is_active' , 'is_live' , 'competition_name']

class EventGameSerializer(serializers.ModelSerializer):
    team1_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='team1.id', allow_null=True, required=False)
    team2_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='team2.id', allow_null=True, required=False)
    team1 = serializers.StringRelatedField()
    team2 = serializers.StringRelatedField()

    class Meta:
        model = EventGame
        fields = ['id' ,'team1', 'team2', 'score' , 'stage' , 'team1_id' , 'team2_id']
        extra_kwargs = {
            'team1_id': {'read_only': True},
            'team2_id': {'read_only': True},
        }


class EventListSerializer(serializers.ModelSerializer):
    top3_teams = serializers.SerializerMethodField(read_only = True)
    competition_name = serializers.CharField(source='competition.name')
    class Meta:
        model = CompetitionEvent
        fields = ['id' ,'name', 'start_date', 'end_date', 'location' , 'top3_teams','competition_name']

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
        serializers = TeamScoreSerializer(top3_teams , many = True)
        return serializers.data