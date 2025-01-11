from django.urls import path

from ..views.competition_views.competition_views import(
    ListCompetitionsView,
    CompetitionProfileView,
    CompetitionCreateView
)

urlpatterns = [
    # Competition APIs
    path('competition-list/', ListCompetitionsView.as_view(), name='competition-list'),
    path('competition-profile/<str:competition_name>/', CompetitionProfileView.as_view(), name='competition-profile'),
    path('create-competition/', CompetitionCreateView.as_view(), name='create-competition'),  # TODO: Add validation and permissions for creating competition.  # TODO: Add pagination and search functionality.   # TODO: Add image upload functionality.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
]