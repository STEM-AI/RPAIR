from django.urls import path , include
from rapair_db.repair_db_urls import tokens_ulrs
from rapair_db.repair_db_urls.user_urls import user_auth_urls


urlpatterns = [
    path('token/', include(tokens_ulrs)),
    path('user/auth/', include(user_auth_urls)),

]