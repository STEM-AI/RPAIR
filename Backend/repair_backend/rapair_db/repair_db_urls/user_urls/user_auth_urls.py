from django.urls import path

from ...views.user_views.auth_views.user_auth_views import (
    UserResgisterView,
    UserLoginView,  
)

from ...views.user_views.auth_views.judge_auth_views import (
    JudgeRegisterView,
)




urlpatterns = [

    # User APIs
    path('auth/user-register/', UserResgisterView.as_view(), name='user-register'),  
    path('auth/login/', UserLoginView.as_view(), name='user-login'),

    # Judge APIs
    path('auth/judge-register/', JudgeRegisterView.as_view(), name='register'),
  
      
]