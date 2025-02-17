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
            self.event_name = data.get("event_name")
            self.game_id = data.get("game_id")
            try:
                game = await sync_to_async(EventGame.objects.get)(id=self.game_id)
            except EventGame.DoesNotExist:
                await self.send(json.dumps({"error": f"Game with ID {self.game_id} not found"}))
                return

            if data["action"] == "start_game": 
                print("Game started")  

                if not self.game_id:
                    await self.send(json.dumps({"error": "Game ID is required"}))
                    return
                
                # Check if the game is already active
                if game.is_active:
                    await self.send(json.dumps({"error": "Game is already active"}))
                    return
                
                if game.completed :
                    await self.send(json.dumps({"error": "Game has already played"}))
                    return

                # Trigger the Celery task
                update_remaining_time.delay(self.event_name, self.game_id)
                await self.send(json.dumps({"message": "Game timer started"}))

            elif data["action"] == "pause_game":
                game.is_paused = True
                await sync_to_async(game.save)()
                await self.send(json.dumps({ "status": "paused" }))

            elif data["action"] == "resume_game":
                game.is_paused = False
                await sync_to_async(game.save)()
                update_remaining_time.delay(self.event_name, self.game_id)
                await self.send(json.dumps({ "status": "resumed" }))

            elif data["action"] == "restart_game":
                game.is_active = False
                game.completed = False
                game.paused_time = 15
                await sync_to_async(game.save)()
                update_remaining_time.delay(self.event_name, self.game_id)
                await self.send(json.dumps({"message": "Game timer restarted"}))

        except json.JSONDecodeError as e:
            await self.send(json.dumps({"error": "Invalid JSON data"}))
        except KeyError as e:
            await self.send(json.dumps({"error": f"Missing key: {e}"}))

    async def game_timer_update(self, event):
        remaining_time = event['remaining_time']
        await self.send(json.dumps({
            'remaining_time': remaining_time
        }))
