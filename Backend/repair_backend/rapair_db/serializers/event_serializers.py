from rest_framework import serializers
from ..models import CompetitionEvent , Team , EventGame
from ..serializers.team_serializers.team_member_serializers import TeamMemberSerializer
from django.db.models import F 


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
        fields = ['id' ,'team1', 'team2', 'score' , 'stage']

class TopTeamsSerializer(serializers.ModelSerializer):
    total_score = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id' , 'name' , 'total_score']

    def get_total_score(self, obj):
        return obj.teamwork_score + obj.interview_score + obj.eng_note_book_score

class EventListSerializer(serializers.ModelSerializer):
    top3_teams = serializers.SerializerMethodField(read_only = True)
    class Meta:
        model = CompetitionEvent
        fields = ['id' ,'name', 'start_date', 'end_date', 'location' , 'top3_teams']

    
    def get_top3_teams(self, obj):
        top3_teams = (
            obj.teams.all()
                .annotate(total_score=F('teamwork_score')+ F('interview_score')+F('inspect_score')+F('eng_note_book_score'))
                .order_by('-total_score')[:3]
        )
        serializers = TopTeamsSerializer(top3_teams , many = True)
        return serializers.data