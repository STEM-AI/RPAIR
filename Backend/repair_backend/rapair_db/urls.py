from django.urls import path , include
from rapair_db.repair_db_urls import (tokens_ulrs ,
    organization_urls , user_urls , team_urls
)




urlpatterns = [
    path('token/', include(tokens_ulrs)),
    path('organization/', include(organization_urls)),
    path('user/', include(user_urls)),
    path('team/', include(team_urls)),
    
]