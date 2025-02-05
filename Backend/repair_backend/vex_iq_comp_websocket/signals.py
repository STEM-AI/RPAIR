from django.db.models.signals import post_save , pre_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from rapair_db.models import EventGame
from channels.layers import get_channel_layer

@receiver(post_save, sender=EventGame)
def broadcast_game_score(sender,created, instance, **kwargs):
    if created :
        return

    if hasattr(instance, 'operation') and instance.operation == 'set_game_score':
        channel_layer = get_channel_layer()

        data = {
            "game_id" : instance.id,
            "team1_name": instance.team1.name,
            "team2_name": instance.team2.name,
            "score":instance.score
        }
        async_to_sync(channel_layer.group_send)(
            f"competition_event_{instance.event.name}",
            {
                "type": "send_game_score",
                "data": data,
            }
        )
