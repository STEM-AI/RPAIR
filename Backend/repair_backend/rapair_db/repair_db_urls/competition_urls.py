from django.urls import path

from ..views.competition_views.competition_views import(
    CompetitionsListView,
    CompetitionProfileView,
    CompetitionCreateView
)
from ..views.competition_views.event_data_views import(
    EventsListWithTop3TeamsView,
)

urlpatterns = [
    # Competition APIs
    path('<str:competition_name>/event/', EventsListWithTop3TeamsView.as_view(), name='competition-event-list'),
    path('list/', CompetitionsListView.as_view(), name='competition-list'),
    path('<str:competition_name>/profile/', CompetitionProfileView.as_view(), name='competition-profile'),
    path('create/', CompetitionCreateView.as_view(), name='create-competition'),  # TODO: Add validation and permissions for creating competition.  # TODO: Add pagination and search functionality.   # TODO: Add image upload functionality.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
]