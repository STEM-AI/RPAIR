from django.urls import path

from ...views.competition_views.event_data_views import(
    EventProfileView,
    LiveEventListView
) 

from ...views.competition_views.event_operations_views import(

    TeamWorkRankView,
    TeamsInterviewScoreRankView , 
    TeamsEngNotebookScoreRank,
    SkillsRankView
)
from ...views.competition_views.judge_event_views import(
    JudgeForCompetitionEventListView
)

urlpatterns =[
    path('<int:id>/profile/', EventProfileView.as_view(), name='event-profile'),  
    path('<str:event_name>/teamwork-rank/', TeamWorkRankView.as_view(), name='teamwork-rank'),  
    path('<str:event_name>/teams-interview-rank/', TeamsInterviewScoreRankView.as_view(), name='team-interview-rank'),  
    path('<str:event_name>/teams-eng-notebook-rank/', TeamsEngNotebookScoreRank.as_view(), name='team-eng-notebook-rank'),  
    path('<str:event_name>/skills-rank/', SkillsRankView.as_view(), name='skills-rank'),  
    path('judge-event-list/', JudgeForCompetitionEventListView.as_view(), name='judge-event-list'), 
    path('live-event-list/', LiveEventListView.as_view(), name='live-event-list'), 
]