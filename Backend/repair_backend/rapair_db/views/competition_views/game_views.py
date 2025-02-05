from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...permissions import IsJudgeUser
from ...utils import event_utils
from ...models import EventGame



class SetGameScoreView(APIView):
    permission_classes = [IsJudgeUser]
    def post(self, request , game_id):
        event_name = request.data.get('event_name', None)
        if event_name is None:
            return Response({"error": "Event name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if game_id is None:
            return Response({"error": "Game ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        

        event = event_utils.get_object(event_name=event_name)
        if event is None:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        
        game = EventGame.objects.filter(id=game_id, event=event).first()
        if game is None:
            return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)
        
        score = request.data.get('score')
        if score is None:
            return Response({"error": "Score is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        game.score = int(score)
        game.operation = "set_game_score"
        game.save()
        return Response({"Game Score Set"}, status=status.HTTP_200_OK)