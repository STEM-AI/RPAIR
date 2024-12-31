from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsSuperUser , AllowAny
from rest_framework_simplejwt.tokens import RefreshToken 
from datetime import datetime
from ....models import User 

class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    def get_object(self, request , username=None):

        if username is not None:
            try :
                return User.objects.filter(username=username).first()
            except User.DoesNotExist: 
                return None
            
    def get_tokens(self, user=None):
            token = RefreshToken.for_user(user)
            access_token_obj = token.access_token
            access_token = str(access_token_obj)
            refresh_token = str(token)
            expiration_timestamp = access_token_obj["exp"]
            expiration_date = datetime.fromtimestamp(expiration_timestamp)
            return Response({
                'access_token': access_token,
                'refresh_token': refresh_token,
                'expiration_date': expiration_date,  # datetime object
            }, status=status.HTTP_200_OK)

            
    def user_login_if_valid_return_tokens(self, request , user = None , password = None):
        if user:
            # User Valid
            if user.check_password(password): 
                # User is already logged in
                return self.get_tokens(user)
            
            else:
                return Response({'User Not Authenticated Incorrect Password'}, status=status.HTTP_401_UNAUTHORIZED) 
                
        else:
            return Response({'User Not Authenticated Incorrect Username'}, status=status.HTTP_401_UNAUTHORIZED) 
    

    def post(self, request):

        username = request.data.get('username')
        password = request.data.get('password')

        if username and password:

            user = self.get_object(request , username=username)
            return self.user_login_if_valid_return_tokens(request, user, password)
        
        else:
            return Response({'Bad Request': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
