from rest_framework import serializers
from ...models import Team 
from .. import OrganizationTeamSerializer 
from .team_coach_serializers import TeamCoachSerializer 
from .team_member_serializers import TeamMemberSerializer
from .team_social_media_serializers import TeamSocialMediaSerializer
from .team_prev_comp_serializers import TeamPreviousCompetitionSerializer
from .team_sponsor_serializers import TeamSponsorSerializer
from ..competitions_serializers import CompetitionsSerializer
from .team_score_serializers import TeamworkScoreSerializer


class TeamSerializer(serializers.ModelSerializer):
    organization_info = serializers.JSONField(write_only=True)
    organization = OrganizationTeamSerializer(read_only=True)
    competition = CompetitionsSerializer(read_only=True)
    sponsors = TeamSponsorSerializer(many=True) 
    coach = TeamCoachSerializer(many=True)
    social_media = TeamSocialMediaSerializer(many=True)
    previous_competition = TeamPreviousCompetitionSerializer(many=True)
    members = TeamMemberSerializer(many=True)
    competition_event = serializers.SerializerMethodField()
    class Meta:
        model = Team
        fields = [
            'name','robot_name','user_id','type','organization_info','team_leader_name','team_leader_email',
            'team_leader_phone_number','organization','competition' ,'sponsors', 'coach', 'social_media',
            'previous_competition' , 'members' , 'competition_event'
            ]

        extra_kwargs = {
            'user_id': {'required': False},
            'organization_id': {'required': False},
            'organization': {'required': False},
            'competition': {'required': False},
            'sponsors': {'required': True},
            'coach': {'required': True},
            'social_media': {'required': True},
            'previous_competition': {'required': True},
            'members': {'required': True},
            'competition_event' :{'required' : False }
        }

    def create(self, validated_data) :

        organization_info = validated_data.pop('organization_info')
        sponsors_info = validated_data.pop('sponsors')
        coachs_info = validated_data.pop('coach')
        social_media_info = validated_data.pop('social_media')
        previous_competition_info = validated_data.pop('previous_competition')
        members_info = validated_data.pop('members')


        event = self.context["event"]

        team = self.Meta.model(**validated_data)
        team.competition_event = event

        team.organization_info = organization_info
        team.sponsors_info = sponsors_info
        team.coachs_info = coachs_info
        team.social_media_info = social_media_info
        team.previous_competition_info = previous_competition_info
        team.members_info = members_info

        team.save()

        return team
    
    def get_competition_event(self,obj):
        if obj.competition_event:
            return obj.competition_event.competition.name
        return None
    

