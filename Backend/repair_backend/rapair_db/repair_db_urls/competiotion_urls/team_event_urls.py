from django.urls import path

from ...views.competition_views.team_event_views import(
    SetTeamScoresFieldsView,
)

urlpatterns = [
    # Competition Team Event APIs
    path('set-team-extra-scores-fields/', SetTeamScoresFieldsView.as_view(), name='set-team-extra-scores-fields'),
]