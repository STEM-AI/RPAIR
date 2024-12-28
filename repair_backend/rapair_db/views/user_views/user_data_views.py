from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated 
from rest_framework import status
from ...serializers.team_serializers import TeamSerializer
from ...serializers.user_serializers.user_data_serializers import UserSerializer


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
        
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data , status=status.HTTP_200_OK)
    
class UserEditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)