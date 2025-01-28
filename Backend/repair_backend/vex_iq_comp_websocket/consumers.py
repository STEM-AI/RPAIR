import json

from channels.generic.websocket import AsyncWebsocketConsumer
from .tasks import update_remaining_time  # Import the Celery task
from rapair_db.models import EventGame
from asgiref.sync import sync_to_async


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
        pass

    # Handler to send score updates to the WebSocket
    async def send_score_update(self, event):
        print("Sent score update")
        print("score" , event["data"])
        await self.send(text_data=json.dumps(event["data"]))



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
        try:
            data = json.loads(text_data)
            print("Parsed data:", data)

            if data["action"] == "start_game":
                print("Starting game")
                event_name = data["event_name"]
                game_id = data.get("game_id")

                if not game_id:
                    await self.send(json.dumps({"error": "Game ID is required"}))
                    return

                # Fetch the game instance
                try:
                    game = await sync_to_async(EventGame.objects.get)(id=game_id)
                    print("Game activated" , game.is_active)
                except EventGame.DoesNotExist:
                    await self.send(json.dumps({"error": f"Game with ID {game_id} not found"}))
                    return
                
                # Check if the game is already active
                if game.is_active:
                    await self.send(json.dumps({"error": "Game is already active"}))
                    return
                
                if game.completed :
                    await self.send(json.dumps({"error": "Game has already played"}))
                    return

                # Trigger the Celery task
                update_remaining_time.delay(event_name, game_id)
                await self.send(json.dumps({"message": "Game timer started"}))

        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {e}")
            await self.send(json.dumps({"error": "Invalid JSON data"}))
        except KeyError as e:
            print(f"Missing key in data: {e}")
            await self.send(json.dumps({"error": f"Missing key: {e}"}))
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


class NewsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Add the client to the 'news_updates' group
        await self.channel_layer.group_add('news_updates', self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Remove the client from the 'news_updates' group
        await self.channel_layer.group_discard('news_updates', self.channel_name)

    async def news_message(self, event):
        # Send the news content to the client
        message = event['message']
        await self.send(text_data=json.dumps({'message': message}))