from django.db.models.signals import post_save 
from django.dispatch import receiver
from ..models import User ,JudgeUser 

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