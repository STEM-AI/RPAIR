import json

from channels.generic.websocket import AsyncWebsocketConsumer


class EventConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract the competition_event ID from the URL
        self.competition_event_name= self.scope["url_route"]["kwargs"]["event_name"]
        print(f"Trying to connect to event: {self.competition_event_name}")

        self.room_group_name = f"competition_event_{self.competition_event_name}"

        # Join the competition event group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        print(f"Disconnected from event: {self.competition_event_name}")
        # Leave the competition event group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # WebSocket messages are not required from the client in this case
        pass

    # Handler to send score updates to the WebSocket
    async def send_score_update(self, event):
        print("Sent score update")
        print("score" , event["data"])
        await self.send(text_data=json.dumps(event["data"]))