from rest_framework import serializers
from ..models import Team


class TeamSerializer(serializers.ModelSerializer):
    organization_info = serializers.JSONField(write_only=True)

    class Meta:
        model = Team
        fields = [
            'id','name','robot_name','user_id','type','organization_info',
            'competition_date','team_leader_name','team_leader_email',
            'team_leader_phone_number','score','organization_id'
            ]

        extra_kwargs = {
            'user_id': {'required': False},
            'organization_id': {'required': False},
        }

    def create(self, validated_data) :

        organization_info = validated_data.pop('organization_info')

        team = self.Meta.model(**validated_data)

        team.custom_args = organization_info

        team.save()
        
        return team



