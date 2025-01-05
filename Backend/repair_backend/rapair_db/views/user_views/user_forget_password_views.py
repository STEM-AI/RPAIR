from rest_framework.views import APIView
from rest_framework.response import Response
from ...serializers.user_serializers.user_data_serializers import UserSerializer 
from ...models import User  , VerifyCode
from rest_framework import status
from ...helpers.generate_verification_code import generate_verification_code
from ...helpers.send_verification_code_email import send_verification_code_email

class UserForgetPasswordView(APIView):

    def get_object(self , email=None):
        if email is not None:
            try :
                return User.objects.filter(email=email).first()
            except User.DoesNotExist: 
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
        return Response('Email Field requried....' , status=status.HTTP_400_BAD_REQUEST)

    def get(self, request , email=None):       
        user = self.get_object(email)
        
        serializer = UserSerializer(user)
        
        return Response({"User Found": serializer.data} , status=status.HTTP_200_OK)

class CreateAndSendEmailWithVerficationCode(APIView):
    def get_object(self, email=None):
        if email is not None:
            try :
                return User.objects.filter(email=email).first()
            except User.DoesNotExist: 
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
        return Response('Email Field requried....' , status=status.HTTP_400_BAD_REQUEST)
    def post(self, request):
        email = request.data.get('email')
        user = self.get_object(email)
        verification_code = generate_verification_code()
        send_verification_code_email(email, verification_code)
        VerifyCode.objects.create(user=user, code=verification_code)
        return Response({"Verification Code sent": f"Verification code sent to {email}"} , status=status.HTTP_200_OK)


class VerifyCode(APIView):
    def get_object(self,email = None , code=None):
        if email is not None:
            try :
                return User.objects.filter(email=email).first()
            except User.DoesNotExist: 
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
        if code is not None:
            try :
                return VerifyCode.objects.filter(code=code).first()
            except VerifyCode.DoesNotExist: 
                return Response({"error": "Verification code not found"}, status=status.HTTP_404_NOT_FOUND)
            
    def verify(self, email = None , code = None):
        user = self.get_object(email)
        if user is None:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        verification_code = self.get_object(code)
        if verification_code is None:
            return Response({"error": "Verification code not found"}, status=status.HTTP_404_NOT_FOUND)
        if verification_code.code!= code:
            return Response({"error": "Verification code does not match"}, status=status.HTTP_400_BAD_REQUEST)
        verification_code.delete()
        return Response({"message": "Verification successful"}, status=status.HTTP_200_OK)
    def post(self, request):
        code = request.data.get('code')
        email = request.data.get('email')
        self.verify(email=email, code=code)

class PasswordResetView(APIView):
    def get_object(self, email=None):
        if email is not None:
            try :
                return User.objects.filter(email=email).first()
            except User.DoesNotExist: 
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
        return Response('Email Field requried....' , status=status.HTTP_400_BAD_REQUEST)
    def patch (self, request):
        email = request.data.get('email')
        user = self.get_object(email)
        if user is None:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        new_password = request.data.get('new_password')
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)