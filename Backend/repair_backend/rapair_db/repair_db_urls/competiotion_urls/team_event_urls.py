from django.urls import path

from ...views.competition_views.team_event_views import(
    TeamNonTechScoreUpdateView
)

urlpatterns = [
    # Competition Team Event APIs
    path('<int:event_id>/non-tech-score/<int:id>/', TeamNonTechScoreUpdateView.as_view(), name='set-team-extra-scores-fields'),

]