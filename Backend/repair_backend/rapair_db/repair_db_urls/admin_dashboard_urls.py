from django.urls import path
from ..views.competition_views.event_data_views import(
    EventsListWithTop3TeamsView,
    EventCreateView
)
from ..views.team_views.team_views import(
    DeleteTeam
)

from ..views.news_views import NewsListCreateView

from ..views.user_views.user_data_views import (
    JudgeUserListView,
    DeleteUser,
    )
from ..views.competition_views.judge_event_views import(
    JudgeForCompetitionEventCreateView
)
urlpatterns = [
    # Competition Event APIs
    path('<str:competition_name>/event-list/', EventsListWithTop3TeamsView.as_view(), name='competition-event-list'),
    path('event/', EventCreateView.as_view(), name='create-event'),  # TODO: Add validation and permissions for creating competition.  # TODO: Add pagination and search functionality.   # TODO: Add image upload functionality.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
    path('news/', NewsListCreateView.as_view(), name='news-list-create'),  # TODO: Add pagination and search functionality.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
    path('<str:team_name>/delete-team/', DeleteTeam.as_view(), name='delete-team'),  # Delete team API  # TODO: Add validation and permissions for deleting team.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
    path('judges/', JudgeUserListView.as_view(), name='judge-list'),  # List all judges API  # TODO: Add pagination and search functionality.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
    path('judge/<str:username>/delete/', DeleteUser.as_view(), name='delete-judge'),  # Delete judge API  # TODO: Add validation and permissions for deleting judge.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add  # TODO: Add  # TODO: Add  # TODO:
    path('judge-event/', JudgeForCompetitionEventCreateView.as_view(), name='judge-event'),  # Judge event API  # TODO: Add validation and permissions for judging event.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add 
]