import json

from channels.generic.websocket import AsyncWebsocketConsumer

from .tasks import update_remaining_time  # Import the Celery task

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
        # print(f"Received text")
        # data = json.loads(text_data)

        # if data["action"] == "start_game":
        #     print("Starting game")
        #     print("data" , data)
        #     game_id = data["game_id"]  # The ID of the game
        #     start_time = data["start_time"]  # The start time sent from the frontend

        #     # Call the Celery task to start the timer in the background
        #     update_remaining_time.delay(game_id, start_time)
        pass

    # Handler to send score updates to the WebSocket
    async def send_score_update(self, event):
        print("Sent score update")
        print("score" , event["data"])
        await self.send(text_data=json.dumps(event["data"]))

    # async def game_timer_update(self, event):
    #     print("Sent game timer update")
    #     remaining_time = event['remaining_time']
    #     print("remaining_time" , remaining_time)
    #     await self.send(json.dumps({
    #         'remaining_time': remaining_time
    #     }))


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract the competition_event ID from the URL
        self.competition_event_name= self.scope["url_route"]["kwargs"]["event_name"]
        self.event_game_id= self.scope["url_route"]["kwargs"]["game_id"]
        print(f"Trying to connect to event: {self.competition_event_name} to game : {self.event_game_id}")

        self.room_group_name = f"competition_event_{self.competition_event_name}_game_{self.event_game_id}"

        # Join the competition event group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        print(f"Disconnected room_group_name: {self.room_group_name}")
        # Leave the competition event group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        print(f"Received text")
        data = json.loads(text_data)

        if data["action"] == "start_game":
            print("Starting game")
            print("data" , data)
            event_name = data["event_name"]
            game_id = data["game_id"]  # The ID of the game
            start_time = data["start_time"]  # The start time sent from the frontend

            # Call the Celery task to start the timer in the background
            update_remaining_time.apply_async(args=[event_name, game_id, start_time], countdown=1)  # Schedule it to run after 1 second

    # Handler to send score updates to the WebSocket
    async def send_score_update(self, event):
        print("Sent score update")
        print("score" , event["data"])
        await self.send(text_data=json.dumps(event["data"]))

    async def game_timer_update(self, event):
        print("Sent game timer update")
        remaining_time = event['remaining_time']
        print("remaining_time" , remaining_time)
        await self.send(json.dumps({
            'remaining_time': remaining_time
        }))