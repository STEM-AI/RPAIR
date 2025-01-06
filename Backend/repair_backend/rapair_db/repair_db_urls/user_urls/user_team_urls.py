from django.urls import path


from ...views.user_views.user_team_views import (
    UserCreateTeamView,
    UserTeamProfileView,
    UserTeamEditTeamProfileView,
    UserChangeTeamOrganizationView,
    UserDeleteTeamView
)


urlpatterns = [

    # User Team APIs
    path('team/create-team/', UserCreateTeamView.as_view(), name='create-team'),
    path('team/team-profile/', UserTeamProfileView.as_view(), name='team-profile'),
    path('team/edit-team/<str:team_name>/', UserTeamEditTeamProfileView.as_view(), name='edit-team'),
    path('team/change-team-organization/<str:team_name>/', UserChangeTeamOrganizationView.as_view(), name='change-team-organization'),
    path('team/delete-team/<str:team_name>/', UserDeleteTeamView.as_view(), name='delete-team'),

]