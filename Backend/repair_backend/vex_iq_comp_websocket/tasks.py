# tasks.py
from celery import shared_task
from django.utils.timezone import now
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rapair_db.models import EventGame
from django.core.management import call_command
GAME_DURATION = 5  # 1 minute

@shared_task
def update_remaining_time(event_name, game_id, start_time=None):
    try:
        game = EventGame.objects.get(id=game_id)
    except EventGame.DoesNotExist:
        return f"Game with ID {game_id} not found."

    # Mark the game as active
    if not game.is_active :
        game.is_active = True
        game.save()

    # Rest of the timer logic
    if start_time is None:
        start_time = now()

    # Calculate the elapsed time
    elapsed_time = (now() - start_time).total_seconds()

    # Calculate the remaining time
    remaining_time = GAME_DURATION - elapsed_time

    if remaining_time <= 0:
        # Game is over
        game.completed = True
        game.is_active = False
        game.save()
        remaining_time = 0
    else:
        # Schedule the task to run again after 1 second
        update_remaining_time.apply_async(args=[event_name, game_id, start_time], countdown=1)

    # Notify the WebSocket group
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"competition_event_{event_name}_game_{game_id}",
        {
            "type": "game_timer_update",
            "remaining_time": remaining_time
        }
    )



@shared_task
def run_create_schedule_command():
    call_command('create_event_schedule')