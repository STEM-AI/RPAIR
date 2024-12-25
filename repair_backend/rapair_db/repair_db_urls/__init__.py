from .user_urls import user_auth_urls , user_data_urls
from . import tokens_ulrs

urlpatterns = (
    user_auth_urls.urlpatterns +
    tokens_ulrs.urlpatterns +
    user_data_urls.urlpatterns
)