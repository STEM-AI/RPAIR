from django.urls import path

from ..views.competition_views.event_views import(
    UpdateTeamScoreEventView ,
    CreateScheduleEventGameView,
    ListScheduleEventGamesView,
) 

urlpatterns =[
    path('<str:event_name>/update-team-score/', UpdateTeamScoreEventView.as_view(), name='update-team-score'),
    path('create-schedule-game/', CreateScheduleEventGameView.as_view(), name='schedule-game'),
    path('<str:event_name>/schedule-games-list/', ListScheduleEventGamesView.as_view(), name='schedule-games-list'),  # List all scheduled games API  # TODO: Add pagination and search functionality.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add

]