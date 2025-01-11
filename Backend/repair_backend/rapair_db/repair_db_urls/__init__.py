# from .user_urls import user_auth_urls , user_data_urls , user_team_urls , user_forget_password_urls , google_auth_urls
from . import tokens_ulrs
from . import organization_urls
from . import user_urls
from . import team_urls
from . import competition_urls

urlpatterns = (
    user_urls.urlpatterns +
    tokens_ulrs.urlpatterns +
    organization_urls.urlpatterns +
    team_urls.urlpatterns +
    competition_urls.urlpatterns 

)