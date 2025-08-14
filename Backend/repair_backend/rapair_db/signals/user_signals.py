from django.db.models.signals import post_save 
from django.dispatch import receiver
from ..models import User ,JudgeUser  , Notification
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


@receiver(post_save, sender=User)
def create_judge(sender , instance , created , **kwargs):
    if created and instance.email.endswith('@rpair.judge.com') :
        instance.is_staff = True
        instance.save(update_fields=['is_staff'])
        JudgeUser.objects.create(user=instance)

@receiver(post_save, sender=User)
def create_admin(sender , instance ,created , **kwargs):
    if created and instance.email.endswith('@rpair.admin.com') :
        instance.is_staff = True
        instance.is_superuser = True
        instance.save(update_fields=['is_staff' , 'is_superuser'])


@receiver(post_save, sender=Notification)
def send_notification_to_user(sender , instance , created , **kwargs):
    print("Sending notification signal" , instance.content)
    print("Sending notification to user" , instance.user.username)
    if created :
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notify_{instance.user.username}',
            {
                'type': 'notification_message',
                'message': {
                    "content":instance.content,
                    "id" : instance.id
                    },
            }
        )