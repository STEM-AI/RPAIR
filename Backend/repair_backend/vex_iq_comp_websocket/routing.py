from django.urls import re_path

from .consumers import (
    EventConsumer,
    GameConsumer,
    NewsConsumer,  # Add NewsConsumer to websocket_urlpatterns if you want to receive news updates.
    NotificationConsumer,  # Add NotificationConsumer to websocket_urlpatterns if you want to receive notification updates.
)

websocket_urlpatterns = [
    re_path(r'ws/competition_event/(?P<event_name>[\w-]+)/$', EventConsumer.as_asgi()),
    re_path(r'ws/competition_event/(?P<event_name>[\w-]+)/game/(?P<game_id>\d+)/$', GameConsumer.as_asgi()),
    
    # Add NewsConsumer to websocket_urlpatterns if you want to receive news updates.
    re_path(r'ws/news/', NewsConsumer.as_asgi()),

    # Add NotificationConsumer to websocket_urlpatterns if you want to receive notification updates.
    re_path(r'ws/notification/', NotificationConsumer.as_asgi()),
]