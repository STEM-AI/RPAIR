from django.urls import path

from ..views.competition_views.competition_views import(
    ListCompetitionsView,
    CompetitionProfileView,
)

urlpatterns = [
    # Competition APIs
    path('competition-list/', ListCompetitionsView.as_view(), name='competition-list'),
    path('competition-profile/<str:competition_name>/', CompetitionProfileView.as_view(), name='competition-profile'),
]