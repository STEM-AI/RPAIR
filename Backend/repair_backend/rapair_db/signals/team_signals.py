from django.db.models.signals import pre_save 
from django.dispatch import receiver
from ..models import Team , Organization , OrganizationContact

@receiver(pre_save , sender=Team)
def get_or_create_organization(sender , instance , **kwargs):
    if hasattr(instance , 'organization_info'):
        organization_info = instance.organization_info
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