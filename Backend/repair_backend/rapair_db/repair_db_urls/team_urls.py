from django.urls import path


from ..views.team_views.team_views import (
    UserCreateTeamView,
    UserTeamProfileView,
    UserTeamEditTeamProfileView,
    UserChangeTeamOrganizationView,
    UserDeleteTeamView,
    ListTeamsView,  # List all teams API  # TODO: Add pagination and search functionality.  
    TeamProfileView
)


urlpatterns = [

    # User Team APIs
    path('create/', UserCreateTeamView.as_view(), name='create-team'),
    path('profile/', UserTeamProfileView.as_view(), name='team-profile'),
    path('<str:team_name>/edit/', UserTeamEditTeamProfileView.as_view(), name='edit-team'),
    path('<str:team_name>/change-organization/', UserChangeTeamOrganizationView.as_view(), name='change-team-organization'),
    path('<str:team_name>/delete/', UserDeleteTeamView.as_view(), name='delete-team'),
    path('list/', ListTeamsView.as_view(), name='teams-list'),  # List all teams API  # TODO: Add pagination and search functionality.
    path('<str:team_name>/team-profile/', TeamProfileView.as_view(), name='admin-team-profile'), 
]