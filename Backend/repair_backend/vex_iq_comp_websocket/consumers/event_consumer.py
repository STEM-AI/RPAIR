import json

from channels.generic.websocket import AsyncWebsocketConsumer

class EventConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]

        if user.is_authenticated:
            await self.accept()
            await self.send(json.dumps({"message": f"Welcome {user.username}!"}))
        else:
            await self.close()
        # Extract the competition_event ID from the URL
        self.competition_event_name= self.scope["url_route"]["kwargs"]["event_name"]

        self.room_group_name = f"competition_event_{self.competition_event_name}"

        # Join the competition event group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
    async def disconnect(self, close_code):
        print(f"Disconnected from event: {self.competition_event_name}")
        # Leave the competition event group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    # Handler to send score updates to the WebSocket
    async def send_game_score(self, event):
        await self.send(text_data=json.dumps(event["data"]))
