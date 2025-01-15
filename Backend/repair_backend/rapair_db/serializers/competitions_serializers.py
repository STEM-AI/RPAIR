from rest_framework import serializers
from ..models import Competition , CompetitionEvent , Team
from ..serializers.team_serializers.team_member_serializers import TeamMemberSerializer

class CompetitionsSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Competition
        fields = ['name','start_date','end_date','location','type','rules','description','image', 'image_url']

        extra_kwargs = {
            'image': {'write_only': True},
        }

    def get_image_url(self, obj):
        request = self.context.get('request')
        image_url = obj.get_image_url()
        if request:
            return request.build_absolute_uri(image_url)
        return image_url
    
class TeamCompetitionProfileSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(many=True)
    class Meta:
        model = Team
        fields = ['name','robot_name','type','members' , 'team_leader_name' , 'score']

    
class CompetitionEventSerializer(serializers.ModelSerializer):
    teams = TeamCompetitionProfileSerializer(many=True)
    class Meta:
        model = CompetitionEvent
        fields = ['start_date', 'end_date', 'location' , 'created_at' , 'teams' ]