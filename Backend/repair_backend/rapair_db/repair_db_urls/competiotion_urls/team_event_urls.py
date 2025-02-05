from django.urls import path

from ...views.competition_views.team_event_views import(
    SetTeamScoresFieldsView,
    TeamWorkRankView
)

urlpatterns = [
    # Competition Team Event APIs
    path('set-team-extra-scores-fields/', SetTeamScoresFieldsView.as_view(), name='set-team-extra-scores-fields'),
    path('teamwork-rank/', TeamWorkRankView.as_view(), name='team-work-rank'),  # Rank teams based on Average of thier Teamwork Score  # TODO: Add validation and permissions for accessing rank.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
]