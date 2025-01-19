from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from rapair_db.models import Team
from channels.layers import get_channel_layer

@receiver(post_save, sender=Team)
def broadcast_score_update(sender, instance, **kwargs):
    if instance.competition_event:
        # Prepare data to send
        data = {
            "team_name": instance.name,
            "score": instance.score,
        }
        print("data sent" , data)
        channel_layer = get_channel_layer()


        # Send the data to the WebSocket group
        async_to_sync(channel_layer.group_send)(
            f"competition_event_{instance.competition_event.name}",
            {
                "type": "send_score_update",
                "data": data,
            }
        )


