from django.conf import settings
from django.urls import path , include
from django.conf.urls.static import static

from rapair_db.repair_db_urls import (
    tokens_ulrs ,organization_urls ,
    user_urls ,team_urls , 
    competition_urls , admin_dashboard_urls ,
    event_urls
)

urlpatterns = [
    path('token/', include(tokens_ulrs)),
    path('organization/', include(organization_urls)),
    path('user/', include(user_urls)),
    path('team/', include(team_urls)),
    path('competition/', include(competition_urls)),
    path('admin/', include(admin_dashboard_urls)),
    path('event/', include(event_urls)),
    
    
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
