# from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
# from rest_framework.response import Response
# from rest_framework import status
from ...permissions import  IsJudgeUser
# from core.utils import event_utils,set_team_score
from rapair_db.serializers import TeamNonTechScoreSerializer
from rapair_db.models import CompetitionEvent,TeamCompetitionEvent
from rest_framework.exceptions import ValidationError
import logging
logger = logging.getLogger(__name__)
class TeamNonTechScoreUpdateView(UpdateAPIView):
    '''Set Inspction , Interview , Engineering Notebook Scores Field'''
    permission_classes=[IsJudgeUser]
    serializer_class = TeamNonTechScoreSerializer
    queryset = TeamCompetitionEvent.objects.all()

    def get_object(self):
        logger.info("get_object")
        event_id = self.kwargs.get("event_id")
        logger.info(f"event_id {event_id}")
        team_id = self.kwargs.get("id")
        logger.info(f"team_id {team_id}")

        # Ensure event exists
        try:
            event = CompetitionEvent.objects.get(id=event_id)
            logger.info(f"event {event}")
        except CompetitionEvent.DoesNotExist:
            raise ValidationError({"event_id": "Event not found."})

        logger.info(f"teamcompetitionevent {TeamCompetitionEvent.objects.all()}")
        # Ensure team exists and belongs to the event
        try:
            team = TeamCompetitionEvent.objects.get(team=team_id, competition_event=event)
            logger.info(f"team {team}")
        except TeamCompetitionEvent.DoesNotExist:
            raise ValidationError({"team": "Team not found for this event."})

        return team

# class SetTeamScoresFieldsView(APIView):
#     '''Set Inspction , Interview , Engineering Notebook Scores Field'''
#     permission_classes = [IsJudgeUser]
#     def post(self, request, event_name):
#         logger.info("Update team score event view")
#         event = event_utils.get_object(event_name = event_name)
#         logger.info("Update team score event")
#         logger.info(f"event_name {event_name}")

#         if event is None:
#             return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

#         team = set_team_score(request = request , event=event)
#         if isinstance(team, Response):
#             return team
        

#         return Response({"message": "Team score updated successfully"}, status=status.HTTP_200_OK)
    
    


