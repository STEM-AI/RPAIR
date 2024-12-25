from rest_framework_simplejwt.views import TokenObtainPairView
from ....serializers.tokens_serializers import MyTokenObtainPairSerializer 
from rest_framework.views import APIView
from rest_framework.response import Response
from ....serializers.user_serializers.user_data_serializers import UserSerializer 
from rest_framework import status
from rest_framework.permissions import IsAuthenticated , IsJudgeUser , IsSuperUser , AllowAny
from rest_framework_simplejwt.tokens import RefreshToken , AccessToken
from datetime import datetime
from ....models import User 


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


        
class UserResgisterView(APIView):

    permission_classes = [IsAuthenticated , IsJudgeUser , IsSuperUser]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(f"message': 'User registered successfully User :{serializer.data} ", status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

        
   
