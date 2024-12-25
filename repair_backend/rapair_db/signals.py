from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User
from .models.user_models import JudgeUser


@receiver(post_save, sender=User)
def create_judge(sender , instance , created , **kwargs):
    if created and instance.email.endswith('@repair.judge.com') :
        instance.is_staff = True
        instance.save(update_fields=['is_staff'])
        JudgeUser.objects.create(user=instance)

@receiver(post_save, sender=User)
def create_admin(sender , instance ,created , **kwargs):
    if created and instance.email.endswith('@repair.admin.com') :
        instance.is_staff = True
        instance.is_superuser = True
        instance.save(update_fields=['is_staff' , 'is_superuser'])

