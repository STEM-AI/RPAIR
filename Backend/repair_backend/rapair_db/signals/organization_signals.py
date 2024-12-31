from django.db.models.signals import pre_delete
from django.dispatch import receiver
from ..models import Team , Organization , OrganizationContact



@receiver(pre_delete, sender=Organization)
def reassign_teams_to_existing_organization(sender, instance, **kwargs):
    """
    Before deleting an organization, reassign its teams to another organization if needed.
    """
    if hasattr(instance , 'new_organization'):
        new_organization = instance.new_organization
        if new_organization :
            organization , created = Organization.objects.get_or_create(
                        name=new_organization['name'] , 
                        defaults={
                            "type": new_organization['type'] , 
                            'address' : new_organization['address'],
                            'email' : new_organization['email']
                            }
                            )
            if created :
                organization.contact = OrganizationContact.objects.create(
                    organization=organization, 
                    phone_number=new_organization['contact_phone_number']
                )
                organization.save()
            
            Team.objects.filter(organization=instance).update(organization=organization)