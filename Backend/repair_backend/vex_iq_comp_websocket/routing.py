from django.urls import re_path

from .consumers import EventConsumer

websocket_urlpatterns = [
    re_path(r'ws/competition_event/(?P<event_name>[\w-]+)/$', EventConsumer.as_asgi()),
]