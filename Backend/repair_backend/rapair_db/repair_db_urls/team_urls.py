from django.urls import path


from ..views.team_views.team_views import (
    UserCreateTeamView,
    UserTeamProfileView,
    UserTeamEditTeamProfileView,
    UserChangeTeamOrganizationView,
    UserDeleteTeamView,
    ListTeamsView,  # List all teams API  # TODO: Add pagination and search functionality.  
)


urlpatterns = [

    # User Team APIs
    path('create-team/', UserCreateTeamView.as_view(), name='create-team'),
    path('team-profile/', UserTeamProfileView.as_view(), name='team-profile'),
    path('edit-team/<str:team_name>/', UserTeamEditTeamProfileView.as_view(), name='edit-team'),
    path('change-team-organization/<str:team_name>/', UserChangeTeamOrganizationView.as_view(), name='change-team-organization'),
    path('delete-team/<str:team_name>/', UserDeleteTeamView.as_view(), name='delete-team'),
    path('teams-list/', ListTeamsView.as_view(), name='teams-list'),  # List all teams API  # TODO: Add pagination and search functionality.

]