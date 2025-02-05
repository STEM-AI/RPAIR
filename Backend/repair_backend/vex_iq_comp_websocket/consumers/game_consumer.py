import json
from channels.generic.websocket import AsyncWebsocketConsumer
from ..tasks import update_remaining_time  # Import the Celery task
from rapair_db.models import EventGame
from asgiref.sync import sync_to_async


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]

        # if user.is_authenticated:
        #     await self.accept()
        #     await self.send(json.dumps({"message": f"Welcome {user.username}!"}))
        # else:
        #     await self.close()
        # Extract the competition_event ID from the URL
        await self.accept()
        self.competition_event_name= self.scope["url_route"]["kwargs"]["event_name"]
        self.event_game_id= self.scope["url_route"]["kwargs"]["game_id"]

        self.room_group_name = f"competition_event_{self.competition_event_name}_game_{self.event_game_id}"

        # Join the competition event group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
    async def disconnect(self, close_code):
        # Leave the competition event group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)

            if data["action"] == "start_game":
                event_name = data["event_name"]
                game_id = data.get("game_id")

                if not game_id:
                    await self.send(json.dumps({"error": "Game ID is required"}))
                    return

                # Fetch the game instance
                try:
                    game = await sync_to_async(EventGame.objects.get)(id=game_id)
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
            await self.send(json.dumps({"error": "Invalid JSON data"}))
        except KeyError as e:
            await self.send(json.dumps({"error": f"Missing key: {e}"}))

    async def game_timer_update(self, event):
        remaining_time = event['remaining_time']
        await self.send(json.dumps({
            'remaining_time': remaining_time
        }))
