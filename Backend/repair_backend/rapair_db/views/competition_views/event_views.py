from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...serializers import EventSerializer
from ...permissions import IsSuperUser
from django.db import connection
from ...utils import event_utils



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