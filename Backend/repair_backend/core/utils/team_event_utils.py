from rest_framework.response import Response
from rest_framework import status
from rapair_db.models import Team

def set_team_score(request , event):
    try:
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

        if scores['eng_notebook_score'] :
            team.eng_notebook_score = scores['eng_notebook_score']
        if scores['interview_score'] :
            team.interview_score = scores['interview_score']
        if scores['inspect_score'] :
            team.inspect_score = scores['inspect_score']

        team.save()

        return team
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)