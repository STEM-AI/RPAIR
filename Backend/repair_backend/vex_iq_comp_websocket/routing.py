from django.urls import re_path

from .consumers import (
    EventConsumer,
    GameConsumer,
)

websocket_urlpatterns = [
    re_path(r'ws/competition_event/(?P<event_name>[\w-]+)/$', EventConsumer.as_asgi()),
    re_path(r'ws/competition_event/(?P<event_name>[\w-]+)/game/(?P<game_id>\d+)/$', GameConsumer.as_asgi()),
]