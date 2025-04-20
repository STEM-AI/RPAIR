from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from ...permissions import  IsJudgeUser
from core.utils import event_utils,set_team_score
from rapair_db.serializers import TeamNonTechScoreSerializer
from rapair_db.models import Team,CompetitionEvent
from rest_framework.exceptions import ValidationError

class TeamNonTechScoreUpdateView(UpdateAPIView):
    '''Set Inspction , Interview , Engineering Notebook Scores Field'''
    permission_classes=[IsJudgeUser]
    serializer_class = TeamNonTechScoreSerializer
    queryset = Team.objects.all()

    def get_object(self):
        event_name = self.kwargs.get("event_name")
        team_id = self.kwargs.get("id")

        # Ensure event exists
        try:
            event = CompetitionEvent.objects.get(name=event_name)
        except CompetitionEvent.DoesNotExist:
            raise ValidationError({"event_name": "Event not found."})

        # Ensure team exists and belongs to the event
        try:
            team = Team.objects.get(id=team_id, competition_event=event)
        except Team.DoesNotExist:
            raise ValidationError({"team": "Team not found for this event."})

        return team

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
    
    


