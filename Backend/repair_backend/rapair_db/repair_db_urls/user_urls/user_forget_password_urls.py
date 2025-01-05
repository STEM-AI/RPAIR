from django.urls import path
from ...views.user_views.user_forget_password_views import (
    UserForgetPasswordView,
    CreateAndSendEmailWithVerficationCode,
    VerifyCode,
    PasswordResetView,
)


urlpatterns = [
    path('forget-password/', UserForgetPasswordView.as_view(), name='forget-password'),
    path('send-verification-code/', CreateAndSendEmailWithVerficationCode.as_view(), name='send-verification-code'),
    path('verify-code/', VerifyCode.as_view(), name='verify-code'),
    path('reset-password/', PasswordResetView.as_view(), name='reset-password'), 
]