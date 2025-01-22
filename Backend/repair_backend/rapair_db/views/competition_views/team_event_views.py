from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...permissions import  IsJudgeUser
from ...utils import event_utils
from ...models import Team 

class SetTeamExtraScoresFieldsEventView(APIView):
    '''Set Inspction , Interview , Engineering Notebook Scores Field'''
    permission_classes = [IsJudgeUser]
    def post(self, request, event_name):
        print("Update team score event view")
        event = event_utils.get_object(event_name = event_name)
        print("Update team score event")
        print("event_name" , event_name)

        if event is None:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

        team_name = request.data.get('team_name')
        scores = request.data.get('scores')

        if team_name is None or scores is None:
            return Response({"error": "Team name and score are required"}, status=status.HTTP_400_BAD_REQUEST)

        team = Team.objects.filter(name=team_name).first()
        print("Team" , team.name)

        if team is None:
            return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

        if team.competition_event != event:
                    return Response({"error": "This team is not associated with the specified event"}, status=status.HTTP_400_BAD_REQUEST)

        team.inspect_score = scores['inspect_score']
        team.eng_note_book_score = scores['eng_note_book_score']
        team.interview_score = scores['interview_score']
        print("pre save")
        team.save()

        return Response({"message": "Team score updated successfully"}, status=status.HTTP_200_OK)
    

