from django.core.mail import send_mail , BadHeaderError
from django.conf import settings
import random
import string
from rest_framework.response import Response
from rest_framework import status
from .user_auth_utlis import UserLogin


def send_verification_code_email(email = None , verification_code = None):
    if email is None or verification_code is None:
        raise ValueError('Both email and verification code are required')
    try:
        subject = 'RPAIR-Reset Password Verification Code'
        message = f'Your verification code is: {verification_code}'
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,  # From email
            [email],  # To email
            fail_silently=True,  # Set to True to suppress exceptions
        )
        
        # For demonstration purposes, we're using a mock email sending function.
        print(f'Sending verification code to {email}: {verification_code}')
    except BadHeaderError:
        print("Invalid header found.")
    except Exception as e:
        print(f"Error sending email: {e}")  
    


# Function to generate a 6-digit verification code using uppercase letters and digits.
def generate_verification_code():

    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

def verify(email = None , code = None):

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
        UserLogin.VERIFIED_EMAIL = True
        # double check
        verification_code.delete()
