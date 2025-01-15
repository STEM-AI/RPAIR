from django.core.mail import send_mail , BadHeaderError
from django.conf import settings

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
    
