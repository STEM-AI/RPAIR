from django.urls import path
from core.views import TeamInterviewRankListView,TeamInterviewView
from vex_123.views import Vex123GameView,Vex123RankView,GameCreateView
urlpatterns = [
    
    path('team/<int:id>/interview/', TeamInterviewView.as_view(), name='team_interview'),
    path('<str:event_name>/team/interview/rank/', TeamInterviewRankListView.as_view(), name='team_interview_rank'),
    path('game/<int:id>/', Vex123GameView.as_view(), name='game_skills'),
    path('<str:event_name>/rank/', Vex123RankView.as_view(), name='game_skills_rank'),
    path('<str:event_name>/game/create/', GameCreateView.as_view(), name='game_create'),
]