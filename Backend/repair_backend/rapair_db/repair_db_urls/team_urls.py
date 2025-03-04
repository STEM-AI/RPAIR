from django.urls import path


from ..views.team_views.team_views import (
    
    ListTeamsView,  # List all teams API  # TODO: Add pagination and search functionality.  
    TeamProfileView,
    TeamGamesListView
)

from ..views.user_views.user_team_views import(
    UserCreateTeamView,
    UserTeamListView,
    UserTeamEditTeamProfileView,
    UserChangeTeamOrganizationView,
    UserDeleteTeamView,
    UserTeamRetrieveView
)


urlpatterns = [

    # User Team APIs
    path('create/', UserCreateTeamView.as_view(), name='create-team'),
    path('user/', UserTeamListView.as_view(), name='team-profile'),
    path('<str:team_name>/', UserTeamRetrieveView.as_view(), name='retrieve-team'),  # Retrieve a team API  # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add team history functionality.   # TODO: Add team scorecard functionality.   # TODO: Add team game statistics functionality
    path('<str:team_name>/edit/', UserTeamEditTeamProfileView.as_view(), name='edit-team'),
    path('<str:team_name>/change-organization/', UserChangeTeamOrganizationView.as_view(), name='change-team-organization'),
    path('<str:team_name>/delete/', UserDeleteTeamView.as_view(), name='delete-team'),

    # Team APIs
    path('list/', ListTeamsView.as_view(), name='teams-list'),  # List all teams API  # TODO: Add pagination and search functionality.
    path('<str:team_name>/team-profile/', TeamProfileView.as_view(), name='admin-team-profile'),
    path('<str:team_name>/games/', TeamGamesListView.as_view(), name='team-games-list'),  # List all games in a team API  # TODO: Add pagination and search functionality.  # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
]