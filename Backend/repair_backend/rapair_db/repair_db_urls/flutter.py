from django.urls import path
from ..views.arduino_flutter import TeamAttachmentListView,TeamAttachmentUpdateView,TeamAttachmentRankingView,TeamScoreUpdateView,TeamAttachmentScoreListView

urlpatterns = [
    path('<int:event_id>/', TeamAttachmentListView.as_view(), name='flutter-team-attachment'),
    path('<int:event_id>/team-attachment/<int:team_id>/', TeamAttachmentUpdateView.as_view(), name='flutter-team-attachment-update'),
    path('<int:event_id>/rank/', TeamAttachmentRankingView.as_view(), name='flutter-team-attachment-ranking'),
    path('<int:event_id>/score/<int:team_id>/', TeamScoreUpdateView.as_view(), name='flutter-team-attachment-score-update'),
    path('<int:event_id>/score-list/', TeamAttachmentScoreListView.as_view(), name='flutter-team-attachment-score-list'),
]
