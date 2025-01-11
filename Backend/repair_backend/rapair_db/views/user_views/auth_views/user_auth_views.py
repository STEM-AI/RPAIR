from rest_framework_simplejwt.views import TokenObtainPairView
from ....serializers.tokens_serializers import MyTokenObtainPairSerializer 
from rest_framework.views import APIView
from rest_framework.response import Response
from ....serializers import UserSerializer 
from rest_framework import status
from rest_framework.permissions import AllowAny
from ....permissions import IsJudgeUser
from ....utils.user_auth_utlis import UserLogin

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

     
class UserResgisterView(APIView):

    permission_classes = [IsJudgeUser]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            print("before send message")
            UserLogin.register_send_welcome_email(request.data.get('email'))
            return Response(f"message': 'User registered successfully User :{serializer.data} ", status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class UserLoginView(APIView):
    permission_classes = [AllowAny]
            
    def post(self, request):
    # from django.contrib.auth import authenticate


        username = request.data.get('username')
        password = request.data.get('password')

        if username and password:
            return UserLogin.user_login_if_valid_return_tokens(username, password)
        
        else:
            return Response({'Bad Request': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

        

        

