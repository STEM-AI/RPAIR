from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from ...serializers import CompetitionsSerializer 
from ...models import Competition
from ...permissions import IsJudgeUser



class CompetitionProfileView(APIView):
    permission_classes = [AllowAny]
    def get(self, request , competition_name=None):
        if competition_name is None:
            return Response({"error": "Competition name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        competition = (
            Competition.objects.filter(name=competition_name)
            .first()
            )
        
        if competition is None:
            return Response({"error": "Competition not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CompetitionsSerializer(competition)
        return Response(serializer.data , status=status.HTTP_200_OK)
    
class CompetitionsListView(APIView):
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
    

        