from django.urls import path
from core.views import TeamInterviewRankListView,TeamInterviewView
from vex_123.views import Vex123GameView,Vex123RankView,GameCreateView
urlpatterns = [
    
    path('team/<int:id>/interview/', TeamInterviewView.as_view(), name='team_interview'),
    path('<int:event_id>/team/interview/rank/', TeamInterviewRankListView.as_view(), name='team_interview_rank'),
    path('game/<int:id>/', Vex123GameView.as_view(), name='game_skills'),
    path('<int:event_id>/rank/', Vex123RankView.as_view(), name='game_skills_rank'),
    path('<int:event_id>/game/<str:stage>/create/', GameCreateView.as_view(), name='game_create'),
]