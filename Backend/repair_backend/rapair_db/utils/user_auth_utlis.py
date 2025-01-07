from ..serializers.tokens_serializers import MyTokenObtainPairSerializer 
from rest_framework.response import Response
from rest_framework import status
from ..models import User 
from datetime import datetime

class UserLogin():
    @staticmethod
    def get_object(email=None , username=None):
            if username:
                try :
                    return User.objects.filter(username=username).first()
                except User.DoesNotExist: 
                    return None               
            if email :
                try :
                        return User.objects.filter(email=email).first()
                except User.DoesNotExist: 
                    return None
                
    @staticmethod
    def get_tokens( user=None):
            token = MyTokenObtainPairSerializer.get_token(user)
            access_token = str(token.access_token)
            refresh_token = str(token)
            expiration_timestamp = token.access_token["exp"]
            expiration_date = datetime.fromtimestamp(expiration_timestamp)
            return Response({
                'access_token': access_token,
                'refresh_token': refresh_token,
                'expiration_date': expiration_date,  # datetime object
            }, status=status.HTTP_200_OK)
    
    @staticmethod
    def user_login_if_valid_return_tokens( username, password):       
           user = UserLogin.get_object(username=username)
           if user:
               # User Valid
               if user.check_password(password): 
                   # User is already logged in
                   return UserLogin.get_tokens(user)
               else:
                   return Response({'User Not Authenticated Incorrect Password'}, status=status.HTTP_401_UNAUTHORIZED) 
           
           else:
               return Response({'User Not Authenticated Incorrect Username'}, status=status.HTTP_401_UNAUTHORIZED)


