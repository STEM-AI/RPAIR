from django.urls import path

from ...views.user_views.user_data_views import (
    UserProfileView,
    UserEditProfileView,
)

from ...views.user_views.user_team_views import (
    UserCreateTeamView,
    UserTeamProfileView,
    UserTeamEditTeamProfileView,
)


urlpatterns = [

    # User Team APIs
    path('create-team/', UserCreateTeamView.as_view(), name='create-team'),
    path('team-profile/', UserTeamProfileView.as_view(), name='team-profile'),
    path('edit-team/<str:team_name>/', UserTeamEditTeamProfileView.as_view(), name='edit-team'),

    # User Profile APIs
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('edit-profile/', UserEditProfileView.as_view(), name='edit-profile'),
]