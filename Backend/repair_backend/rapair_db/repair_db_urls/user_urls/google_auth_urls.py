from django.urls import path
from ...views.user_views.auth_views.google_auth_views import GoogleSignInAPIView, GoogleSignUpAPIView

urlpatterns = [
    path('auth/google-signin/', GoogleSignInAPIView.as_view(), name='google_signin'),
    path('auth/google-signup/', GoogleSignUpAPIView.as_view(), name='google_signup'),
]
