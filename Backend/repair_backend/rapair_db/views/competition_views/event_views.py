from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...serializers import EventSerializer
from ...permissions import IsSuperUser ,IsJudgeUser
from django.db import connection
from ...utils import event_utils
from ...models import EventGame
from ...serializers import EventGameSerializer
from rest_framework.permissions import AllowAny
from datetime import datetime, timedelta



class EventCreateView(APIView):
    permission_classes = [IsSuperUser]
    def post(self, request):
        competition = event_utils.get_object(request.data.get('competition_name'))
        if competition is None:
            return Response({"error": "Competition not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(competition=competition)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        

class EventsListView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request, competition_name):
        competition = event_utils.get_object(competition_name)

        if competition is None:
            return Response({"error": "Competition not found"}, status=status.HTTP_404_NOT_FOUND)


        query = event_utils.TOP_3_TEAMS_QUERY
        with connection.cursor() as cursor:
            cursor.execute(query, [competition_name])
            result = cursor.fetchall()
        

        return Response(result, status=status.HTTP_200_OK)
    

    
class CreateScheduleEventGameView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        event_name = request.data.get('event_name', None)
        if event_name is None:
            return Response({"error": "Event name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        event = event_utils.get_object(event_name=event_name)
        if event is None:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        
        print("event" , event)
        
        event_teams = event.teams.all() 
        print("event_teams" , event_teams)
        game_time = request.data.get('time')
        game_time = datetime.strptime(game_time,"%H:%M")
        print("game_time" , game_time.time())
        games = []
        for i in range(len(event_teams)):
            for j in range(i + 1, len(event_teams)):
                games.append(EventGame(event= event ,team1=event_teams[i], team2=event_teams[j], time=game_time.time()))
                game_time += timedelta(minutes=1, seconds=30)
        
        print("games" , games)
        try :
            EventGame.objects.bulk_create(games)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"message": "Games scheduled successfully."}, status=status.HTTP_201_CREATED)
    


class ListScheduleEventGamesView(APIView):
    permission_classes = [AllowAny]
    def get(self, request , event_name):
        event = event_utils.get_object(event_name=event_name)
        if event is None:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        
        games = EventGame.objects.filter(event=event)
        serializer = EventGameSerializer(games, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
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
        
        print("Game Score" , score)
        
        game.score = int(score)
        game.save()
        return Response({"Game Score Set"}, status=status.HTTP_200_OK)
          