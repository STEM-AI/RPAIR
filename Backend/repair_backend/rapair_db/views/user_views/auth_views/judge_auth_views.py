from rest_framework.views import APIView
from rest_framework.response import Response
from ....serializers.user_serializers.user_data_serializers import UserSerializer 
from rest_framework import status
from rest_framework.permissions import IsSuperUser , AllowAny
from ....utils.user_auth_utlis import UserLogin


class JudgeRegisterView(APIView):
    permission_classes = [IsSuperUser]
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(f"message': 'User registered successfully User :{serializer.data} ", status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class JudgeLogin(APIView):
    permission_classes = [AllowAny]
             
    def post(self, request):

        username = request.data.get('username')
        password = request.data.get('password')

        if username and password:
            return UserLogin.user_login_if_valid_return_tokens(username, password)
        
        else:
            return Response({'Bad Request': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
