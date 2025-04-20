from django.urls import path
from core.views import ScheduleListView,ScheduleDetailView,GamesScheduleCreateView
urlpatterns = [

    path('event/<str:event_name>/schedule/', ScheduleListView.as_view(), name='schedule_list'),
    path('event/schedule/<int:pk>/', ScheduleDetailView.as_view(), name='schedule_detail'),
    path('event/<str:event_name>/games/schedule/', GamesScheduleCreateView.as_view(), name='games_schedule'),
]