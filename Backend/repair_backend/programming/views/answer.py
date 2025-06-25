from rest_framework.views import APIView
from programming.models import Answer
from programming.models import Question
from rapair_db.models import EventGame
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
import logging
logger = logging.getLogger(__name__)

class AnswerQuestionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        event_game_id = request.data.get('event_game_id')
        question_id = request.data.get('question_id')
        answer_id = request.data.get('answer_id')
        
        event_game = get_object_or_404(EventGame, id=event_game_id)
        question = get_object_or_404(Question, id=question_id)
        
        if event_game.is_active or event_game.is_paused or event_game.completed:
            return Response({"error": "Game is not active"}, status=status.HTTP_400_BAD_REQUEST)

        
        answer = get_object_or_404(Answer, id=answer_id)
        
        if answer.question != question:
            return Response({"error": "Answer is not for this question"}, status=status.HTTP_400_BAD_REQUEST)
        
        if answer.is_correct:
            logger.info(f"answer.is_correct: {answer.is_correct}")
            event_game.score += 1
            event_game.save()
        
        return Response({"message": "Answer submitted successfully"}, status=status.HTTP_200_OK)
        
        
