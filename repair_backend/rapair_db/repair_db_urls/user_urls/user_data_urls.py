from django.urls import path

from ...views.user_views.user_data_views import (
    UserCreateTeamView,
)


urlpatterns = [
    path('create-team/', UserCreateTeamView.as_view(), name='create-team'),
]