import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = self.scope["user"]
        print("Connecting to user" , user)

        if user.is_authenticated:
            await self.accept()
            await self.send(json.dumps({"message": f"Welcome {user.username}!"}))
        else:
            await self.close()

        await self.channel_layer.group_add(f'notify_{user.username}' , self.channel_name)
    
    async def disconnect(self, close_code):
        user = self.scope["user"]
        # Perform any necessary cleanup here
        await self.channel_layer.group_discard(f'notify_{user.username}', self.channel_name)

    async def notification_message(self, event):
        message = event['message']
        print("notification" , message)
        await self.send(text_data=json.dumps({'message': message}))