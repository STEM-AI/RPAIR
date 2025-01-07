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

# class GoogleSignUpAPIView(APIView):
#     permission_classes = [IsJudgeUser]
#     def post(self, request):
        
#         id_token_str = request.data.get('id_token')

#         if not id_token_str:
#             return Response({'error': 'ID token is required'}, status=status.HTTP_400_BAD_REQUEST)


#         id_token_payload = id_token.verify_oauth2_token(
#             id_token_str,
#             requests.Request(),
#             settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
#         )
#         if not id_token_payload:
#             return Response({'error': 'Invalid ID token'}, status=status.HTTP_401_UNAUTHORIZED)
        
#         if not id_token_payload.get('email_verified') :
#             return Response({'error': 'Email not verified'}, status=status.HTTP_401_UNAUTHORIZED)
        
#         user_data = {
#             'email': id_token_payload['email'],
#             'name': id_token_payload['name'],
#             'first_name': id_token_payload['given_name'],
#             'last_name': id_token_payload['family_name'],
#             'google_verified' : id_token_payload['google_verified'],
#             **request.data
#         }

#         print("user_data" , user_data)

#         serializer = UserSerializer(data = user_data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(f"message': 'User registered successfully User :{serializer.data} ", status=status.HTTP_201_CREATED)
        
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         # user, created = User.objects.update_or_create(
#         #     email=user_data['email'],
#         #     defaults=user_data
#         # )
#         # if created:
#         #     user.set_password(user_data['id'])
#         #     user.save()
#         # return Response(f"message': 'User registered successfully User :{serializer.data} ", status=status.HTTP_201_CREATED)



# class GoogleSignInAPIView(APIView):
#     permission_classes = [AllowAny]
#     def get_tokens(self, user):
#         token = MyTokenObtainPairSerializer().get_token(user)
#         refresh_token = token.refresh_token
#         access_token = token.access_token
#         return {
#             'access_token': access_token,
#             'refresh_token': refresh_token,
#             'token_type': 'Bearer',
#             'expires_in': token.token_type._get_expiration_time() - datetime.utcnow()
#         }
#     def get_object(self, request, email=None):
#         if email is None:
#             return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)
        
#         user = (
#             User.objects.filter(email=email)
#             .first()
#         )
#         return user
    
#     # def user_login_if_valid_return_tokens(self, request, user, password):
#     #     if user.check_password(password):
#     #         return self.get_tokens(user)
#     #     else:
#     #         return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
#     def post(self, request):

#         id_token_str = request.data.get('id_token')
#         try:
#             id_token_payload = id_token.verify_oauth2_token(
#                 id_token_str, 
#                 requests.Request(), 
#                 settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
#             )

#             #  email = id_info.get('email')
#             email = id_token_payload['email']
#             user = self.get_object(request, email)

#             if user is None:
#                 return Response({'User Not Found'}, status=status.HTTP_401_UNAUTHORIZED)
            
#             tokens =  self.get_tokens(user)
            
#             return Response({'message': 'Sign In successful', 'tokens':tokens}, status=status.HTTP_200_OK)
        
#         except ValueError:
#             return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

#             # return self.user_login_if_valid_return_tokens(request, user, request.data.get('password'))


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
        user , created = User.objects.get_or_create(
            email=email,
            defaults={
                'name': id_token_payload['name'],
                'first_name': id_token_payload['given_name'],
                'last_name': id_token_payload['family_name'],
                'google_verified' : id_token_payload['google_verified'],
            }
        )
        if created:
            serializer = UserSerializer(user)
            return Response({'success': serializer.data}, status = status.HTTP_201_CREATED)

        tokens =  UserLogin.get_tokens(user)
        return Response({'success': 'User already exists', 'tokens':tokens}, status = status.HTTP_200_OK)
    
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
            tokens =  UserLogin.get_tokens(user)
            return Response({'success': serializer.data, 'tokens':tokens}, status=status.HTTP_200_OK)
             
        

        

        