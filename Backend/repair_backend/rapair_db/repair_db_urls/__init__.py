from .user_urls import user_auth_urls , user_data_urls , user_team_urls , user_forget_password_urls
from . import tokens_ulrs
from .organization_urls import organization_urls

urlpatterns = (
    user_auth_urls.urlpatterns +
    tokens_ulrs.urlpatterns +
    user_data_urls.urlpatterns +
    organization_urls.urlpatterns +
    user_team_urls.urlpatterns +
    user_forget_password_urls.urlpatterns
)