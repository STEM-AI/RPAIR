from rest_framework import serializers
from ..models import CompetitionEvent , Team , EventGame
from ..serializers.team_serializers.team_member_serializers import TeamMemberSerializer


class TeamCompetitionProfileSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(many=True)
    total_score = serializers.SerializerMethodField()
    class Meta:
        model = Team
        fields = ['name','robot_name','type','members' , 'team_leader_name' , 'total_score']

    def get_total_score(self, obj):
        return obj.teamwork_score + obj.interview_score + obj.eng_note_book_score

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
        fields = ['id' ,'team1', 'team2', 'score']