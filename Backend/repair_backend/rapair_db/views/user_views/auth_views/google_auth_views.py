from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from ....serializers import UserSerializer 
from rest_framework.permissions import IsJudgeUser ,AllowAny
from rest_framework import status
from ....models import User 
from ....utils.user_auth_utlis import UserLogin


class GoogleLoginInAndRegisterView(APIView):
    permission_classes = [AllowAny]
    # Full Flow
    # User clicks "Sign in with Google" in React.
    # Google provides an ID token to the React app.
    # React sends the token to the Django backend.
    # Django verifies the token using Google's API.
    # If valid, the backend authenticates or registers the user and returns a response.
    
    def post(self, request):
        id_token_str = request.data.get('id_token')
        print("Google")
        print("id_token: " , id_token_str)

        if not id_token_str:
            return Response({'error': 'ID token is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        id_token_payload = id_token.verify_oauth2_token(
            id_token_str, 
            requests.Request(), 
            settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
        )

        if not id_token_payload:
            return Response({'error': 'Invalid ID token'}, status=status.HTTP_401_UNAUTHORIZED)

        email = id_token_payload['email']
        print("email: " , email)
        print("name" ,id_token_payload['name'] )
        print("first_name: " ,id_token_payload['given_name'])
        print("google_verified" ,id_token_payload['email_verified'])
        user , created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': id_token_payload['name'],
                'google_verified' : id_token_payload['email_verified'],
            }
        )
        if created:
            print("created: ")
            serializer = UserSerializer(user)
            return Response({'success': serializer.data}, status = status.HTTP_201_CREATED)

        return UserLogin.get_tokens(user)
    
    def patch(self , request):
        email = request.data.pop('email', None)
        user = UserLogin.get_object(email=email)
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        #rest_of_user_data = {'phone_number' : '' , 'phone_number' : '' , 'date_of_birth' : '' , 'address' : '' ,'created_at': '' , 'country' : ''}
        rest_of_user_data = request.data

        if not user:
             return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(user, data=rest_of_user_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return UserLogin.get_tokens(user)
             
        

        

        