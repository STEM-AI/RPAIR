from django.db.models.signals import pre_save ,post_save
from django.dispatch import receiver
from ..models import Team , Organization , OrganizationContact , TeamSponsor , TeamCoach , TeamPreviousCompetition , TeamSocialMedia , TeamMember

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

@receiver(post_save , sender=Team)
def get_or_create_sponsor(sender, instance, created, **kwargs):
    if created and hasattr(instance , 'sponsors_info'):
        sponsors_info = instance.sponsors_info
        if sponsors_info :
            for sponsor_data in sponsors_info:
                sponsor , created = TeamSponsor.objects.get_or_create(
                    name=sponsor_data['name'] , 
                    defaults={
                        'email' : sponsor_data['email'],
                        'team' : instance
                        }
                        )
                sponsor.save()

@receiver(post_save , sender=Team)
def add_team_coachs(sender, instance, created, **kwargs):
    if created and hasattr(instance , 'coachs_info'):
        coachs_info = instance.coachs_info
        if coachs_info :
            for coach_data in coachs_info:
                TeamCoach.objects.create(
                    team=instance,
                    **coach_data
                )

@receiver(post_save , sender=Team)
def add_team_socail_media(sender, instance, created, **kwargs):
    if created and hasattr(instance , 'social_media_info'):
        social_media_info = instance.social_media_info
        if social_media_info :
            for platform_data in social_media_info:
                TeamSocialMedia.objects.create(
                    team=instance,
                    **platform_data
                )


@receiver(post_save , sender=Team)
def add_team_previous_competition(sender, instance, created, **kwargs):
    if created and hasattr(instance , 'previous_competition_info'):
        previous_competition_info = instance.previous_competition_info
        if previous_competition_info :
            for competition_data in previous_competition_info:
                TeamPreviousCompetition.objects.create(
                    team=instance,
                    **competition_data
                )

@receiver(post_save , sender=Team)
def add_team_members(sender, instance, created, **kwargs):
    if created and hasattr(instance , 'members_info'):
        members_info = instance.members_info
        if members_info :
            for member_data in members_info:
                TeamMember.objects.create(
                    team=instance,
                    **member_data
                )