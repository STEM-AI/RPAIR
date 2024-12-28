from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated 
from rest_framework import status
from ...serializers.team_serializers import TeamSerializer
from ...models import Team

class UserCreateTeamView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        print("data" , request.data)
        serializer = TeamSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(user_id=request.user.id)
            return Response(f"message': 'Team created successfully Team :{serializer.data} ", status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class UserTeamProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        team = Team.objects.filter(user=user)
        serializer = TeamSerializer(team , many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UserTeamEditTeamProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self, request, team_name):
        user = request.user
        team = Team.objects.filter(user=user, name=team_name).first()
        serializer = TeamSerializer(team, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

