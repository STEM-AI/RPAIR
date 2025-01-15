from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from ...serializers import CompetitionsSerializer , CompetitionEventSerializer
from ...models import Competition , CompetitionEvent
from ...permissions import IsJudgeUser , IsSuperUser


class CompetitionProfileView(APIView):
    permission_classes = [AllowAny]
    def get(self, request , competition_name=None):
        if competition_name is None:
            return Response({"error": "Competition name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        competition = (
            Competition.objects.filter(name=competition_name)
            .prefetch_related('teams')
            .first()
            )
        
        if competition is None:
            return Response({"error": "Competition not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CompetitionsSerializer(competition)
        return Response(serializer.data , status=status.HTTP_200_OK)
    
class ListCompetitionsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        competitions = Competition.objects.all()
        serializer = CompetitionsSerializer(competitions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CompetitionCreateView(APIView):
    permission_classes = [IsJudgeUser]
    def post(self, request):
        serializer = CompetitionsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CompetitionEventListView(APIView):
    permission_classes = [IsSuperUser]

    def get_object(self, competition_name):
        try:
            return Competition.objects.get(name=competition_name)
        except Competition.DoesNotExist:
            return None
    def get(self, request, competition_name):

        print("competition_name" , competition_name)

        competition = self.get_object(competition_name)

        if competition is None:
            return Response({"error": "Competition name is required"}, status=status.HTTP_404_NOT_FOUND)
        
        events = (
            CompetitionEvent.objects.filter(competition=competition)
            .prefetch_related('teams')
            .select_related('competition')
            )
        serializer = CompetitionEventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
