from django.urls import path
from ..views.competition_views.event_data_views import(
    EventsListWithTop3TeamsView,
    EventCreateView
)
from ..views.team_views.team_views import(
    DeleteTeam
)

from ..views.news_views import NewsListCreateView

urlpatterns = [
    # Competition Event APIs
    path('<str:event_name>/event-list/', EventsListWithTop3TeamsView.as_view(), name='competition-event-list'),
    path('event/', EventCreateView.as_view(), name='create-event'),  # TODO: Add validation and permissions for creating competition.  # TODO: Add pagination and search functionality.   # TODO: Add image upload functionality.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
    path('news/', NewsListCreateView.as_view(), name='news-list-create'),  # TODO: Add pagination and search functionality.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
    path('<str:team_name>/delete-team/', DeleteTeam.as_view(), name='delete-team'),  # Delete team API  # TODO: Add validation and permissions for deleting team.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
]