from rest_framework import serializers
from ...models import Team , TeamMember
from .. import OrganizationTeamSerializer 
from .team_coach_serializers import TeamCoachSerializer 
from .team_member_serializers import TeamMemberSerializer
from .team_social_media_serializers import TeamSocialMediaSerializer
from .team_prev_comp_serializers import TeamPreviousCompetitionSerializer
from .team_sponsor_serializers import TeamSponsorSerializer
from ..competition_serializers.competitions_serializers import CompetitionsSerializer

class TeamMinimalSerializer(serializers.ModelSerializer):
    is_completed = serializers.BooleanField(source='competition_event.is_completed',read_only=True)
    class Meta:
        model = Team
        fields = ['id','name','is_completed']

class TeamSerializer(serializers.ModelSerializer):
    organization_info = serializers.JSONField(write_only=True, required=False)
    organization = OrganizationTeamSerializer(read_only=True)
    competition = CompetitionsSerializer(read_only=True)
    sponsors = TeamSponsorSerializer(many=True, required=False) 
    coach = TeamCoachSerializer(many=True, required=False)
    social_media = TeamSocialMediaSerializer(many=True, required=False)
    previous_competition = TeamPreviousCompetitionSerializer(many=True, required=False)
    members = TeamMemberSerializer(many=True)
    competition_event = serializers.SerializerMethodField()
    team_number = serializers.CharField(required=False, allow_null=True)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Team
        fields = [
            'name', 'robot_name', 'user_id', 'type', 'organization_info', 'team_leader_name', 'team_leader_email',
            'team_leader_phone_number', 'organization', 'competition', 'sponsors', 'coach', 'social_media',
            'previous_competition', 'members', 'competition_event', 'id', 'team_number', 'image'
        ]

        extra_kwargs = {
            'user_id': {'required': False},
            'organization_id': {'required': False},
            'organization': {'required': False},
            'competition': {'required': False},
            'sponsors': {'required': False},
            'coach': {'required': False},
            'social_media': {'required': False},
            'previous_competition': {'required': False},
            'members': {'required': True},
            'team_number': {'required': False},
            'image': {'required': False},
        }

    def validate(self, attrs):
        print("attrs",attrs)
        return super().validate(attrs)

    def create(self, validated_data):
        print("validated_data",validated_data)
        organization_info = validated_data.pop('organization_info', None)
        sponsors_info = validated_data.pop('sponsors', None)
        coachs_info = validated_data.pop('coach', None)
        social_media_info = validated_data.pop('social_media', None)    
        previous_competition_info = validated_data.pop('previous_competition', None)
        members_info = validated_data.pop('members', None)

        event = self.context["event"]

        team = self.Meta.model(**validated_data)
        team.competition_event = event

        if organization_info:
            team.organization_info = organization_info
        if sponsors_info:
            team.sponsors_info = sponsors_info
        if coachs_info:
            team.coachs_info = coachs_info
        if social_media_info:
            team.social_media_info = social_media_info
        if previous_competition_info:
            team.previous_competition_info = previous_competition_info
        if members_info:
            team.members_info = members_info

        team.save()
        return team
    
    def get_competition_event(self,obj):
        try:
            if obj.competition_event:
                return obj.competition_event.competition.name
            return None
        except Exception as e:
            return str(e)


class TeamListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id','name']

class TeamMemberCertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id','name']

class TeamCertificationSerializer(serializers.ModelSerializer):
    members = TeamMemberCertificationSerializer(many=True,read_only=True)
    competition_name = serializers.CharField(source='competition_event.competition.name')
    start_date = serializers.CharField(source='competition_event.start_date')   
    class Meta:
        model = Team
        fields = ['id','name','members','competition_name','start_date','team_leader_name']


