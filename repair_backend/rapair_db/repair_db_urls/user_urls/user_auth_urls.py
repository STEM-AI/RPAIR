from django.urls import path

from ...views.user_views.user_auth_views import (
    JudgeRegisterView,
    UserResgisterView,
    AdminLoginView,
    JudgeLogin
)


urlpatterns = [
    path('judge-register/', JudgeRegisterView.as_view(), name='register'),
    path('user-register/', UserResgisterView.as_view(), name='user-register'),  # for judges and admins only
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),  # for admins only
    path('judge-login/', JudgeLogin.as_view(), name='judge-login'),  # for judges only
]