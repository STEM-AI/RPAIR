from rest_framework import serializers
from ..models import Team
from ..serializers import OrganizationTeamSerializer
from ..serializers import OrganizationSerializer
# from .organization_serializers import OrganizationTeamSerializer


class TeamSerializer(serializers.ModelSerializer):
    organization_info = serializers.JSONField(write_only=True)
    organization = OrganizationTeamSerializer(read_only=True)
    class Meta:
        model = Team
        fields = [
            'name','robot_name','user_id','type','organization_info',
            'competition_date','team_leader_name','team_leader_email',
            'team_leader_phone_number','score','organization'
            ]

        extra_kwargs = {
            'user_id': {'required': False},
            'organization_id': {'required': False},
            'organization': {'required': False},
        }

    def create(self, validated_data) :

        organization_info = validated_data.pop('organization_info')

        team = self.Meta.model(**validated_data)

        team.custom_args = organization_info

        team.save()

        return team



