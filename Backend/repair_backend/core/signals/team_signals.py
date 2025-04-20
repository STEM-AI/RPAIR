from django.db.models.signals import pre_save ,post_save
from django.dispatch import receiver
from rapair_db.models import (
    Team , Organization , OrganizationContact , TeamSponsor , TeamCoach , 
    TeamPreviousCompetition , TeamSocialMedia , TeamMember , EventGame,
    )

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
                sponsor = TeamSponsor.objects.create(
                        team = instance,
                        **sponsor_data
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


@receiver(post_save , sender=EventGame)
def add_team_score(sender, instance, created, **kwargs):
    print("event game signalss")
    print("created" , created)
    print("")
    if created :
        return
    if hasattr(instance, 'operation') and instance.operation == 'set_teamwork_game_score':
        instance.team1.teamwork_scores.create(score = instance.score,game=instance)
        instance.team2.teamwork_scores.create(score = instance.score,game=instance)

    if hasattr(instance, 'operation') and instance.operation == 'set_skills_game_score':
        print("setting team skills score sginals")
        if instance.stage in ['driver_iq','driver_go','vex_123']:
            print("Setting driver scores")
            skills_score, created = instance.team1.skills_scores.get_or_create(
                team=instance.team1,
                defaults={
                    'driver_score': instance.driver_score,
                    'autonomous_score': 0
                }
            )
            if not created:
                print("updating driver scores")
                skills_score.driver_score = instance.driver_score
                print("autonomous_score", skills_score.autonomous_score)
                skills_score.save()
        elif instance.stage in ['auto','coding']:
            print("instance.team1" , instance.team1)
            print("Setting autonomous scores")
            skills_score, created = instance.team1.skills_scores.get_or_create(
                team=instance.team1,
                defaults={
                    'autonomous_score': instance.autonomous_score,
                    'driver_score': 0
                }
            )
            if not created:
                print("updating autonomous scores")
                skills_score.autonomous_score = instance.autonomous_score
                print("driver_score", skills_score.driver_score)
                skills_score.save()

