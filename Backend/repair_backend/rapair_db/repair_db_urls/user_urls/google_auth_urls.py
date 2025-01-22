from django.urls import path
from ...views.user_views.auth_views.google_auth_views import GoogleLoginInAndRegisterView
urlpatterns = [
    path('auth/google-login/', GoogleLoginInAndRegisterView.as_view(), name='google-login'),   
]
