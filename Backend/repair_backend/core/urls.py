from django.urls import path
from core.views import ScheduleListView,ScheduleDetailView,GamesScheduleCreateView,GameListView,GameIDRetrieveView
urlpatterns = [

    path('event/<int:event_id>/schedule/', ScheduleListView.as_view(), name='schedule_list'),
    path('event/schedule/<int:pk>/', ScheduleDetailView.as_view(), name='schedule_detail'),
    path('event/<int:event_id>/games/schedule/', GamesScheduleCreateView.as_view(), name='games_schedule'),
    path('event/<int:event_id>/<str:stage>/games/', GameListView.as_view(), name='game_list'),
    path('game-id/<int:team_id>/<int:event_id>/<str:stage>/', GameIDRetrieveView.as_view(), name='game_id_retrieve'),
]