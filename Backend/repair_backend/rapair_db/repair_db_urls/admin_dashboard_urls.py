from django.urls import path
from ..views.competition_views.competition_views import(
    CompetitionEventListView
)

urlpatterns = [
    # Competition Event APIs
    path('competition-event-list/<str:competition_name>/', CompetitionEventListView.as_view(), name='competition-event-list'),
]