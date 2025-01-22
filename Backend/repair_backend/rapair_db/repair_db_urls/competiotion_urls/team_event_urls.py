from django.urls import path

from ...views.competition_views.team_event_views import(
    SetTeamExtraScoresFieldsEventView,
)

urlpatterns = [
    # Competition Team Event APIs
    path('set-team-extra-scores-fields/', SetTeamExtraScoresFieldsEventView.as_view(), name='set-team-extra-scores-fields'),
]