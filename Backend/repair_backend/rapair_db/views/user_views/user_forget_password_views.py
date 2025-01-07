from rest_framework.views import APIView
from rest_framework.response import Response
from ...serializers.user_serializers.user_data_serializers import UserSerializer 
from ...models import User  , VerificationCode
from rest_framework import status
from ...utils.generate_verification_code import generate_verification_code
from ...utils.send_verification_code_email import send_verification_code_email
from ...utils.user_auth_utlis import UserLogin

class UserForgetPasswordView(APIView):

    def get(self, request , email=None):       
        user = UserLogin.get_object(email)
        
        serializer = UserSerializer(user)
        
        return Response({"User Found": serializer.data} , status=status.HTTP_200_OK)

class CreateAndSendEmailWithVerficationCode(APIView):

    def post(self, request):

        email = request.data.get('email')

        if email is None:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = UserLogin.get_object(email)
        verification_code = generate_verification_code()
        send_verification_code_email(email, verification_code)
        # check if the user is already has a virfication code and if exists then create a new one and send it and update the verification code
        VerificationCode.objects.create(user=user, code=verification_code)
        return Response({f"Verification Code {verification_code} sent": f"Verification code sent to {email}"} , status=status.HTTP_200_OK)


class VerifyCode(APIView):

    def verify(self, email = None , code = None):

        if email is None:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if code is None:
            return Response({"error": "Verification code is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = UserLogin.get_object(email)

        if user is None:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        verification_code = user.verificationcode_set.first()

        if verification_code is None:
            return Response({"error": "Verification code not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if verification_code.code!= code:
            return Response({"error": "Verification code does not match"}, status=status.HTTP_400_BAD_REQUEST)
        # double check
        verification_code.delete()
    def post(self, request):
        code = request.data.get('code')
        email = request.data.get('email')
        self.verify(email=email, code=code)
        return Response({"message": "Verification successful"}, status=status.HTTP_200_OK)


class PasswordResetView(APIView):
    def patch (self, request):

        email = request.data.get('email')

        if email is None:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = UserLogin.get_object(email)

        if user is None:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # use the serializer here 
        new_password = request.data.get('new_password')
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)