from rapair_db.serializers.tokens_serializers import MyTokenObtainPairSerializer 
from rest_framework.response import Response
from rest_framework import status
from rapair_db.models import User 
from datetime import datetime
from django.core.mail import send_mail
from django.conf import settings


class UserLogin():
    VERIFIED_EMAIL = False
    @staticmethod
    def get_object(email=None , username=None):
            if username:
                try :
                    return User.objects.filter(username=username).first()
                except User.DoesNotExist: 
                    return None               
            if email:
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
            return {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'expiration_date': expiration_date,  
            }
    
    @staticmethod
    def user_login_if_valid_return_tokens( username, password):       
           user = UserLogin.get_object(username=username)
           if user:
               # User Valid
               if user.check_password(password): 
                   # User is already logged in
                   tokens = UserLogin.get_tokens(user)
                   return Response(tokens, status=status.HTTP_200_OK)
               else:
                   return Response({'User Not Authenticated Incorrect Password'}, status=status.HTTP_401_UNAUTHORIZED) 
           
           else:
               return Response({'User Not Authenticated Incorrect Username'}, status=status.HTTP_401_UNAUTHORIZED)
           
    @staticmethod
    def register_send_welcome_mail(email):
          # Send welcome email here
        subject = 'Welcom To RPAIR'
        message = f'Welcome to RPAIR'
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,  # From email
            [email],  # To email
            fail_silently=True,  # Set to True to suppress exceptions
        )


