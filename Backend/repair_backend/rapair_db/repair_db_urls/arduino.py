from django.urls import path
from ..views.arduino_flutter import TeamAttachmentListView,TeamAttachmentUpdateView,TeamAttachmentRankingView,TeamScoreUpdateView

urlpatterns = [
    path('<str:event_name>/', TeamAttachmentListView.as_view(), name='arduino-team-attachment'),
    path('<str:event_name>/team-attachment/<int:team_id>/', TeamAttachmentUpdateView.as_view(), name='arduino-team-attachment-update'),
    path('<str:event_name>/rank/', TeamAttachmentRankingView.as_view(), name='arduino-team-attachment-ranking'),
    path('<str:event_name>/score/<int:team_id>/', TeamScoreUpdateView.as_view(), name='arduino-team-attachment-score-update'),
]
