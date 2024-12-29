from .user_urls import user_auth_urls , user_data_urls
from . import tokens_ulrs
from .data_urls import organization_urls

urlpatterns = (
    user_auth_urls.urlpatterns +
    tokens_ulrs.urlpatterns +
    user_data_urls.urlpatterns +
    organization_urls.urlpatterns
)