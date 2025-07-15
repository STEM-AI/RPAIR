from rest_framework import serializers
from ...models import CompetitionEvent , Team , EventGame , TeamworkTeamScore , Organization
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
    teams = TeamCompetitionProfileSerializer(many=True, required=False, read_only=True)
    competition_name = serializers.CharField(source='competition.name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    organization = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        required=False,
        write_only=True
    )
    
    class Meta:
        model = CompetitionEvent
        fields = [
            'id', 'name', 'start_date', 'end_date', 'location', 'teams',
            'fees', 'age', 'category', 'is_active', 'is_live',
            'competition_name', 'organization_name', 'organization'
        ]

    def validate(self, attrs):
        request = self.context.get('request')
        if request and not request.user.is_superuser:
            # For non-superusers, organization is required
            if 'organization' not in attrs:
                raise serializers.ValidationError(
                    {"organization": "Organization is required for non-superusers."}
                )
            
            # Verify that the user owns the organization
            if attrs['organization'].owner != request.user:
                raise serializers.ValidationError(
                    {"organization": "You can only create events for organizations you own."}
                )
        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        
        # For non-superusers, automatically set their organization
        if not request.user.is_superuser:
            organization = Organization.objects.filter(owner=request.user).first()
            if not organization:
                raise serializers.ValidationError(
                    {"organization": "You must own an organization to create events."}
                )
            validated_data['organization'] = organization
        
        return super().create(validated_data)

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
    # top3_teams = serializers.SerializerMethodField(read_only = True)
    competition_name = serializers.CharField(source='competition.name')
    organization_name = serializers.CharField(source='organization.name',default=None)
    class Meta:
        model = CompetitionEvent
        fields = ['id' ,'name', 'start_date', 'end_date', 'location','competition_name', 'organization_name']

    # @extend_schema_field(serializers.ListField(child=serializers.DictField()))
    # def get_top3_teams(self, obj):
    #     top3_teams = (
    #             TeamworkTeamScore.objects
    #             .select_related('team' , 'team_competition_event')  # Fetch the related Team model
    #             .filter(team__competition_event=obj)
    #             .values('team', 'team__name')  # Include team name directly
    #             .annotate(avg_score=Avg('score'))
    #             .order_by('-avg_score')[:3]
    #             )
    #     serializers = TeamScoreSerializer(top3_teams , many = True)
    #     return serializers.data