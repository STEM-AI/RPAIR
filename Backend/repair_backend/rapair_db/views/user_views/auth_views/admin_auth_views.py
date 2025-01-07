from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from ....utils.user_auth_utlis import UserLogin

class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get('username')
        password = request.data.get('password')

        if username and password:
            return UserLogin.user_login_if_valid_return_tokens(username, password)
        
        else:
            return Response({'Bad Request': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

