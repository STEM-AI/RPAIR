import jwt
from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from rapair_db.models import User

class JWTAuthMiddleware(BaseMiddleware):
    """
    Middleware to authenticate WebSocket connections using JWT tokens.
    """

    async def __call__(self, scope, receive, send):
        # Extract JWT token from query string
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token", [None])[0]  # Extract the first token if exists

        if token:
            try:
                # Decode and verify the JWT token
                access_token = AccessToken(token)
                user = await self.get_user(access_token["user_id"])
                scope["user"] = user  # Attach user to the scope
            except jwt.ExpiredSignatureError:
                scope["user"] = AnonymousUser()
            except (jwt.DecodeError, AuthenticationFailed):
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_id):
        """ Fetch user from database. """
        try:
            return User.objects.get(id=user_id)  # Update with your user model
        except User.DoesNotExist:
            return AnonymousUser()
