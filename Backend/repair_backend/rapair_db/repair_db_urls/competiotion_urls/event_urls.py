from django.urls import path

from ...views.competition_views.event_views import(
    EventProfileView,
    GetEventSchedule,
    CreateScheduleEventGameView,
    TeamWorkRankView,
    TeamInterviewScoreRankView , 
    TeamEngNotebookScoreRank

) 

urlpatterns =[
    path('<str:event_name>/schedule-games/', CreateScheduleEventGameView.as_view(), name='schedule-game'),
    path('<str:event_name>/event-profile/', EventProfileView.as_view(), name='event-profile'),  # Get event details API  # TODO: Add validation and permissions for viewing event details.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
    path('<str:event_name>/schedule/', GetEventSchedule.as_view(), name='schedule-game'),
    path('<str:event_name>/teamwork-rank/', TeamWorkRankView.as_view(), name='teamwork-rank'),  # Get teamwork rank API  # TODO: Add validation and permissions for viewing teamwork rank.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
    path('<str:event_name>/team-interview-score-rank/', TeamInterviewScoreRankView.as_view(), name='team-interview-score-rank'),  # Get team interview score rank API  # TODO: Add validation and permissions for viewing team interview score rank.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO:
    path('<str:event_name>/team-eng-notebook-score-rank/', TeamEngNotebookScoreRank.as_view(), name='team-eng-notebook-score-rank'),  # Get team eng notebook score rank API  # TODO: Add validation and permissions for viewing team eng notebook score rank.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO
]