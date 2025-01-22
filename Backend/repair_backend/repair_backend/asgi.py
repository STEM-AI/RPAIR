"""
ASGI config for repair_backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

# Load your ASGI app in the following variable.
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from vex_iq_comp_websocket.routing import websocket_urlpatterns
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'repair_backend.settings')

application = ProtocolTypeRouter({
    'websocket': AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                [
                    *websocket_urlpatterns,  # Add your WebSocket URL routing here
                ]
            )
        )
    ),
    "http": get_asgi_application(),  # For HTTP requests
    # Other protocol types can be added here.
})
