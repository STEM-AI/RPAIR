# from .user_urls import user_auth_urls , user_data_urls , user_team_urls , user_forget_password_urls , google_auth_urls
from . import (
    tokens_ulrs , organization_urls , 
    user_urls , team_urls , 
    competition_urls , admin_dashboard_urls ,
    event_urls ,
    )

urlpatterns = (
    user_urls.urlpatterns +
    tokens_ulrs.urlpatterns +
    organization_urls.urlpatterns +
    team_urls.urlpatterns +
    competition_urls.urlpatterns +
    admin_dashboard_urls.urlpatterns +
    event_urls.urlpatterns
)