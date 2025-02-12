from django.conf import settings
from django.urls import path , include
from django.conf.urls.static import static

from rapair_db.repair_db_urls import (
    tokens_ulrs ,user_urls ,team_urls , 
    competition_urls , admin_dashboard_urls
)
from rapair_db.repair_db_urls.competiotion_urls import (
    event_urls, organization_urls , 
    team_event_urls , game_urls)

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


urlpatterns = [
    path('token/', include(tokens_ulrs)),
    path('organization/', include(organization_urls)),
    path('user/', include(user_urls)),
    path('team/', include(team_urls)),
    path('competition/', include(competition_urls)),
    path('admin/', include(admin_dashboard_urls)),
    path('event/', include(event_urls)),
    path('team_event/', include(team_event_urls)),
    path('game/', include(game_urls)),
    path('docs/', SpectacularAPIView.as_view(), name='api-docs'),
    path('redoc/', SpectacularRedocView.as_view(url_name='api-docs'), name='redoc'),
    path('swagger/', SpectacularSwaggerView.as_view(url_name='api-docs'), name='swagger-ui'),

    
    
    
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
