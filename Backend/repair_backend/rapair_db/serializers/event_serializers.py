from rest_framework import serializers
from ..models import Competition , CompetitionEvent , Team
from ..serializers.team_serializers.team_member_serializers import TeamMemberSerializer


class TeamCompetitionProfileSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(many=True)
    class Meta:
        model = Team
        fields = ['name','robot_name','type','members' , 'team_leader_name' , 'score']

class EventSerializer(serializers.ModelSerializer):
    teams = TeamCompetitionProfileSerializer(many=True , required=False)
    class Meta:
        model = CompetitionEvent
        fields = ['start_date', 'end_date', 'location' , 'teams' ]

        extra_kwargs = {
            'teams': {'read_only': True},
        }