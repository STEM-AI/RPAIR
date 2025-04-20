from django.urls import path
from vex_go.views import SkillsRankView,GameCoopView,CoopRankView
from core.views import TeamInterviewRankListView,TeamInterviewView,GamesScheduleCreateView,GameSkillsView
urlpatterns = [
    
    path('team/<int:id>/interview/', TeamInterviewView.as_view(), name='team_interview'),
    path('<str:event_name>/team/interview/rank/', TeamInterviewRankListView.as_view(), name='team_interview_rank'),

    path('game/<int:id>/skills/', GameSkillsView.as_view(), name='game_skills'),
    path('<str:event_name>/skills/rank/', SkillsRankView.as_view(), name='game_skills_rank'),

    path('game/<int:id>/coop/', GameCoopView.as_view(), name='game_coop'),
    path('<str:event_name>/coop/rank/', CoopRankView.as_view(), name='game_coop_rank'),

]
