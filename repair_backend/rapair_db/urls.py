from django.urls import path , include
from rapair_db.repair_db_urls import (
    user_auth_urls , user_data_urls , tokens_ulrs ,
    organization_urls  ,
)




urlpatterns = [
    path('token/', include(tokens_ulrs)),
    path('user/auth/', include(user_auth_urls)),
    path('user/data/', include(user_data_urls)),
    path('organization/', include(organization_urls)),

]