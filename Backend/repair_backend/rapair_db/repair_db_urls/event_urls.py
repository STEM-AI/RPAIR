from django.urls import path

from ..views.competition_views.event_views import(
    UpdateTeamScoreEventView
) 

urlpatterns =[
    path('<str:event_name>/update-team-score/', UpdateTeamScoreEventView.as_view(), name='update-team-score'),
]