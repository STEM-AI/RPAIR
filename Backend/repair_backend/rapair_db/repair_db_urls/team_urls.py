from django.urls import path


from ..views.team_views.team_views import (
    
    TeamListView,  # List all teams API  # TODO: Add pagination and search functionality.  
    TeamRetrieveDestroyView,
    TeamGamesListView,
    TeamCertificationView
)

from ..views.user_views.user_team_views import(
    UserTeamListCreateView,
    UserTeamRetrieveUpdateDestroyView,

)


urlpatterns = [

    # User Team APIs
    path('user/', UserTeamListCreateView.as_view(), name='team-profile'),
    path('user/<int:id>/', UserTeamRetrieveUpdateDestroyView.as_view(), name='edit-team'),

    # Team APIs
    path('list/', TeamListView.as_view(), name='teams-list'),  # List all teams API  # TODO: Add pagination and search functionality.
    path('<int:id>/', TeamRetrieveDestroyView.as_view(), name='admin-team-profile'),
    path('<str:team_name>/games/', TeamGamesListView.as_view(), name='team-games-list'),  # List all games in a team API  # TODO: Add pagination and search functionality.  # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
    path('<int:team_id>/certification/', TeamCertificationView.as_view(), name='team-certification')
]