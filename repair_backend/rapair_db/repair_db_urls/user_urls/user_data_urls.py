from django.urls import path

from ...views.user_views.user_data_views import (
    UserCreateTeamView,
    UserProfileView,
    UserEditProfileView,
)


urlpatterns = [
    path('create-team/', UserCreateTeamView.as_view(), name='create-team'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('edit-profile/', UserEditProfileView.as_view(), name='edit-profile'),
]