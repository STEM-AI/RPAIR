from celery import shared_task
from rapair_db.models import EventGame
from django.utils.timezone import now, make_aware
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from datetime import datetime
# from rapair_db.utils.event_utils import get_object


GAME_DURATION = 60
@shared_task
def update_remaining_time(event_name , game_id , game_start_time):
    """
    Update the remaining time for a game and notify WebSocket group when the time is up.
    """
    print("Update remaining time for game")

    # event = get_object(event_name=event_name)
    
    try:
        game = EventGame.objects.get(id=game_id)
    except EventGame.DoesNotExist:
        return f"Game with ID {game_id} not found." 

    # Convert game_start_time (in milliseconds) to a naive datetime object
    game_start_time = datetime.fromtimestamp(game_start_time / 1000)

    print("game_start_time before make_aware" , game_start_time)

    # Convert game_start_time to a timezone-aware datetime (assuming default timezone is UTC)
    game_start_time = make_aware(game_start_time)

    print("game_start_time after make_aware" , game_start_time)

    # Get the current time (timezone-aware)
    current_time = now()

    print("current_time", current_time)

    # Calculate the elapsed time in seconds
    elapsed_time = (current_time - game_start_time).total_seconds()

    print("Elapsed time in seconds", elapsed_time)

    remaining_time = GAME_DURATION - elapsed_time
    print("Remaining time in the update_remaining_time", remaining_time)

    if remaining_time <= 0:
        print("game end")
        game.is_active = False
        game.save()
        remaining_time = 0

    # Notify WebSocket group

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"competition_event_{event_name}_game_{game.id}",
        {
            "type": "game_timer_update",
            "remaining_time": remaining_time
        }
    )

    if remaining_time > 0:
        print("still waiting for")
        update_remaining_time.apply_async(args=[event_name, game_id, game_start_time.timestamp() * 1000], countdown=1)

