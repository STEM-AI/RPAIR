from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...serializers import EventSerializer
from ...permissions import IsSuperUser , IsJudgeUser
from django.db import connection
from ...utils import event_utils
from ...models import Team ,EventGame
from ...serializers import TeamSerializer , EventGameSerializer
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
    

class UpdateTeamScoreEventView(APIView):
    permission_classes = [IsJudgeUser]
    def patch(self, request, event_name):
        print("Update team score event view")
        event = event_utils.get_object(event_name = event_name)
        print("Update team score event")
        print("event_name" , event_name)

        if event is None:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

        team_name = request.data.get('team_name')
        score = request.data.get('score')

        if team_name is None or score is None:
            return Response({"error": "Team name and score are required"}, status=status.HTTP_400_BAD_REQUEST)

        team = Team.objects.filter(name=team_name).first()
        print("Team" , team.name)

        if team is None:
            return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

        if team.competition_event != event:
                    return Response({"error": "This team is not associated with the specified event"}, status=status.HTTP_400_BAD_REQUEST)

        team.score = score
        print("pre save")
        team.save()

        return Response({"message": "Team score updated successfully"}, status=status.HTTP_200_OK)
    
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
          