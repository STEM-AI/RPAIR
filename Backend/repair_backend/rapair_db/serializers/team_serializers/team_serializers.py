from rest_framework import serializers
from ...models import Team 
from .. import OrganizationTeamSerializer 
from . import TeamCoachSerializer ,TeamPreviousCompetitionSerializer ,TeamSocialMediaSerializer ,TeamSponsorSerializer
from ..competitions_serializers import CompetitionsSerializer


class TeamSerializer(serializers.ModelSerializer):
    organization_info = serializers.JSONField(write_only=True)
    organization = OrganizationTeamSerializer(read_only=True)
    competition = CompetitionsSerializer(read_only=True)
    sponsors = TeamSponsorSerializer(many=True) 
    coach = TeamCoachSerializer(many=True)
    social_media = TeamSocialMediaSerializer(many=True)
    previous_competition = TeamPreviousCompetitionSerializer(many=True)
    class Meta:
        model = Team
        fields = [
            'name','robot_name','user_id','type','organization_info',
            'competition_date','team_leader_name','team_leader_email',
            'team_leader_phone_number','score','organization','competition' , 
            'sponsors', 'coach', 'social_media','previous_competition'
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
        }

    def create(self, validated_data) :

        organization_info = validated_data.pop('organization_info')

        competition = self.context["competition"]

        team = self.Meta.model(**validated_data)
        team.competition = competition

        team.organization_info = organization_info

        team.save()

        return team



