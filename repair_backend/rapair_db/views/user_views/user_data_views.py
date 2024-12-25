from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated 
from rest_framework import status
from ...serializers.team_serializers import TeamSerializer


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