from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...permissions import  IsJudgeUser
from ...utils import event_utils
from ...utils.team_event_utils import set_team_score
from django.db.models import Avg
from ...models import TeamworkTeamScore
from ...serializers import TeamworkScoreSerializer


class SetTeamScoresFieldsView(APIView):
    '''Set Inspction , Interview , Engineering Notebook Scores Field'''
    permission_classes = [IsJudgeUser]
    def post(self, request, event_name):
        print("Update team score event view")
        event = event_utils.get_object(event_name = event_name)
        print("Update team score event")
        print("event_name" , event_name)

        if event is None:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

        team = set_team_score(request = request , event=event)
        if isinstance(team, Response):
            return team
        

        return Response({"message": "Team score updated successfully"}, status=status.HTTP_200_OK)
    
    

class TeamWorkRankView(APIView):
    '''Rank teams based on Average of thier Teamwork Score'''
    permission_classes = [IsJudgeUser]
    def get(self, request):
        try:

            teams = (
                TeamworkTeamScore.objects
                .select_related('team')  # Fetch the related Team model
                .values('team', 'team__name')  # Include team name directly
                .annotate(avg_score=Avg('score'))
                .order_by('-avg_score')
                )
            print(teams)
            serializers = TeamworkScoreSerializer(teams, many=True)
            return Response(serializers.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
