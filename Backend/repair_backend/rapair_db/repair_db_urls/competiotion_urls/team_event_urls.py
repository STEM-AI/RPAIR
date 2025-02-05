from django.urls import path

from ...views.competition_views.team_event_views import(
    SetTeamScoresFieldsView,
    # SkillsTeamScoreListView
)

urlpatterns = [
    # Competition Team Event APIs
    path('set-team-extra-scores-fields/', SetTeamScoresFieldsView.as_view(), name='set-team-extra-scores-fields'),
    # path('skills-team-score-list/<str:event_name>/', SkillsTeamScoreListView.as_view(), name='skills-team-score-list'),  # Get skills team score list API  # TODO: Add validation and permissions for viewing skills team score list.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality
]