from django.urls import path
from vex_go.views import *

urlpatterns = [
    
    path('event/<str:event_name>/games/schedule/', GamesScheduleCreateView.as_view(), name='games_schedule'),


    path('team/<int:id>/interview/', TeamInterviewView.as_view(), name='team_interview'),
    path('team/interview/rank/', TeamInterviewRankListView.as_view(), name='team_interview_rank'),

    path('game/<int:id>/skills/', GameSkillsView.as_view(), name='game_skills'),
    path('<str:event_name>/skills/rank/', SkillsRankView.as_view(), name='game_skills_rank'),

    path('game/<int:id>/coop/', GameCoopView.as_view(), name='game_coop'),
    path('<str:event_name>/coop/rank/', CoopRankView.as_view(), name='game_coop_rank'),

]
