from django.db.models.signals import post_save , pre_save , pre_delete
from django.dispatch import receiver
from .models import User , Team ,JudgeUser , Organization , OrganizationContact


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

@receiver(pre_save , sender=Team)
def get_or_create_organization(sender , instance , **kwargs):
    if hasattr(instance , 'custom_args'):
        organization_info = instance.custom_args
        if organization_info :
            organization , created = Organization.objects.get_or_create(
                name=organization_info['name'] , 
                defaults={
                    "type": organization_info['type'] , 
                    'address' : organization_info['address'],
                    'email' : organization_info['email']
                    }
                    )
            if created :
                organization.contact = OrganizationContact.objects.create(
                    organization=organization, 
                    phone_number=organization_info['contact_phone_number']
                )
                organization.save()
            instance.organization_id = organization.id


@receiver(pre_delete, sender=Organization)
def reassign_teams_to_existing_organization(sender, instance, **kwargs):
    """
    Before deleting an organization, reassign its teams to another organization if needed.
    """
    existing_organization = Organization.objects.filter(name=instance.name).exclude(id=instance.id).first()
    
    if existing_organization:
        # Reassign teams to the existing organization
        Team.objects.filter(organization=instance).update(organization=existing_organization)
    else:
        # Handle the case when no organization with the same name is found
        # For example, create a new organization or handle accordingly
        new_org = Organization.objects.create(name=f"Reassigned-{instance.name}")
        Team.objects.filter(organization=instance).update(organization=new_org)