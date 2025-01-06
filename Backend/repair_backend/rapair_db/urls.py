from django.urls import path , include
from rapair_db.repair_db_urls import (tokens_ulrs ,
    organization_urls , user_urls
)
# from rapair_db.repair_db_urls import




urlpatterns = [
    path('token/', include(tokens_ulrs)),
    path('organization/', include(organization_urls)),
    path('user/', include(user_urls)),
    
]