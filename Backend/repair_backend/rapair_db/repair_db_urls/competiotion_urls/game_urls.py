from django.urls import path
from ...views.competition_views.game_views import(
    GameScoreView,
)
urlpatterns = [
    path('<int:game_id>/set-game-score/', GameScoreView.as_view(), name='set-game-score'),  # Set game score API  # TODO: Add validation and permissions for setting score.   # TODO: Add notification and email functionality for judges.   # TODO: Add leaderboard functionality.   # TODO: Add team registration functionality.   # TODO: Add team submission functionality.   # TODO: Add
]