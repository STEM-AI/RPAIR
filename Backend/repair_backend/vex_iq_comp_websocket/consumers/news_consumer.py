import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NewsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]

        if user.is_authenticated:
            await self.accept()
            await self.send(json.dumps({"message": f"Welcome {user.username}!"}))
        else:
            await self.close()
        # Add the client to the 'news_updates' group
        await self.channel_layer.group_add('news_updates', self.channel_name)

    async def disconnect(self, close_code):
        # Remove the client from the 'news_updates' group
        await self.channel_layer.group_discard('news_updates', self.channel_name)

    async def news_message(self, event):
        # Send the news content to the client
        message = event['message']
        await self.send(text_data=json.dumps({'message': message}))