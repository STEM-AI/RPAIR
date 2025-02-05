from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...permissions import  IsJudgeUser
from ...utils import event_utils
from ...utils.team_event_utils import set_team_score
from rest_framework import generics
from ...models import SkillsTeamScore
from ...serializers import SkillsTeamScoreSerializer


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
    
    

# class SkillsTeamScoreListView(generics.ListView):
#     permission_classes = [IsJudgeUser]
#     queryset = SkillsTeamScore.objects.all()
#     serializer_class = SkillsTeamScoreSerializer
#     def get_queryset(self):
#         queryset = super().get_queryset()
#         queryset = queryset.filter(team__competition_event__event_name=self.kwargs['event_name'])
#         return queryset
    