from django.urls import path

from ...views.competition_views.event_views import(
    EventProfileView,
    GetEventSchedule,
    CreateScheduleEventGameView
) 

urlpatterns =[
    path('<str:event_name>/schedule-games/', CreateScheduleEventGameView.as_view(), name='schedule-game'),
    path('<str:event_name>/event-profile/', EventProfileView.as_view(), name='event-profile'),  # Get event details API  # TODO: Add validation and permissions for viewing event details.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
    path('<str:event_name>/schedule/', GetEventSchedule.as_view(), name='schedule-game'),
]