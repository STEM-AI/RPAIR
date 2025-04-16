from django.urls import path

from ...views.competition_views.event_data_views import(
    EventProfileView,
) 

from ...views.competition_views.event_operations_views import(
    GetEventSchedule,
    CreateScheduleEventGameView,
    TeamWorkRankView,
    TeamsInterviewScoreRankView , 
    TeamsEngNotebookScoreRank,
    SkillsRankView
)
# from ...views.competition_views.judge_event_views import(
#     JudgeForCompetitionEventListView
# )

urlpatterns =[
    path('<str:event_name>/games-schedule/', CreateScheduleEventGameView.as_view(), name='schedule-game'),
    path('<str:event_name>/profile/', EventProfileView.as_view(), name='event-profile'),  # Get event details API  # TODO: Add validation and permissions for viewing event details.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
    path('<str:event_name>/schedule/', GetEventSchedule.as_view(), name='schedule-game'),
    path('<str:event_name>/teamwork-rank/', TeamWorkRankView.as_view(), name='teamwork-rank'),  # Get teamwork rank API  # TODO: Add validation and permissions for viewing teamwork rank.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
    path('<str:event_name>/teams-interview-rank/', TeamsInterviewScoreRankView.as_view(), name='team-interview-rank'),  # Get team interview score rank API  # TODO: Add validation and permissions for viewing team interview score rank.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO:
    path('<str:event_name>/teams-eng-notebook-rank/', TeamsEngNotebookScoreRank.as_view(), name='team-eng-notebook-rank'),  # Get team eng notebook score rank API  # TODO: Add validation and permissions for viewing team eng notebook score rank.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO
    path('<str:event_name>/skills-rank/', SkillsRankView.as_view(), name='skills-rank'),  
    # path('judge-event-list/', JudgeForCompetitionEventListView.as_view(), name='judge-event-list'),  # List judged events API  # TODO: Add validation and permissions for viewing judged events.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add

]