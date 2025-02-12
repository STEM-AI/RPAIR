from rest_framework.views import APIView
from rest_framework.response import Response
from ...serializers.user_serializers.user_data_serializers import UserSerializer 
from ...models import VerificationCode , User
from rest_framework import status
from ...utils.forget_password_utils import generate_verification_code , send_verification_code_email , verify
from ...utils.user_auth_utlis import UserLogin
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny

class UserForgetPasswordView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    lookup_field = 'email'


class CreateAndSendEmailWithVerficationCode(APIView):

    def post(self, request):

        email = request.data.get('email')

        if email is None:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = UserLogin.get_object(email)
        
        # check if the user is already has a virfication code and if exists then create a new one and send it and update the verification code
        if VerificationCode.objects.filter(user=user).exists():
            verification_code = VerificationCode.objects.filter(user=user).first()
            verification_code.code = generate_verification_code()
            verification_code.save()
        else:  # create a new verification code for the user
            verification_code = generate_verification_code()  # Generate a new verification code
            user.verificationcode_set.create(code=verification_code)  # Create a new verification code object for the 

        send_verification_code_email(email=email, verification_code=verification_code)  # Send the verification code to the user's email
        return Response({f"Verification Code {verification_code} sent": f"Verification code sent to {email}"} , status=status.HTTP_200_OK)


class VerifyCode(APIView):

    def post(self, request):
        code = request.data.get('code')
        email = request.data.get('email')
        verify(email=email, code=code)
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
        if UserLogin.VERIFIED_EMAIL :
            new_password = request.data.get('new_password')
            user.set_password(new_password)
            user.save()
            UserLogin.VERIFIED_EMAIL = False  # Reset the verified flag to False so that the user can't use the same verification code to reset their password again.
            return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User not verified"}, status=status.HTTP_401_UNAUTHORIZED)