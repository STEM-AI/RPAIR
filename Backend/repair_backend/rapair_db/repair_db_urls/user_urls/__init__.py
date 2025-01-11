from ..team_urls import team_urls
from . import user_auth_urls , user_data_urls , user_forget_password_urls , google_auth_urls


urlpatterns = (
    user_auth_urls.urlpatterns +
    user_data_urls.urlpatterns +
    team_urls.urlpatterns +
    user_forget_password_urls.urlpatterns +
    google_auth_urls.urlpatterns
)
