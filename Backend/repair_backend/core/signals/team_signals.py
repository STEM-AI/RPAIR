from django.db.models.signals import post_save
from django.dispatch import receiver
from rapair_db.models import (
    Team , TeamSponsor , TeamCoach , 
    TeamPreviousCompetition , TeamSocialMedia , TeamMember , EventGame,
    TeamCompetitionEvent
    )
import logging
logger = logging.getLogger(__name__)

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

@receiver(post_save , sender=Team)
def add_team_competition_event(sender, instance, created, **kwargs):
    if created and hasattr(instance , 'event'):
        event = instance.event
        if event :
            TeamCompetitionEvent.objects.create(
                team=instance,
                competition_event=event
            )

@receiver(post_save , sender=EventGame)
def add_team_score(sender, instance, created, **kwargs):
    logger.info(f"event game signalss {instance}")
    logger.info(f"created {created}")
    logger.info(f"instance {instance}")
    if created :
        return
    if hasattr(instance, 'operation') and instance.operation == 'set_teamwork_game_score':
        instance.team1.teamwork_scores.create(score = instance.score,game=instance)
        instance.team2.teamwork_scores.create(score = instance.score,game=instance)

    if hasattr(instance, 'operation') and instance.operation == 'set_skills_game_score':
        logger.info("setting team skills score sginals")
        if instance.stage in ['driver_iq','driver_go']:
            logger.info("Setting driver scores")
            # Try to find an existing record with driver_score = 0
            existing_score = instance.team1.skills_scores.filter(
                driver_score=0
            ).first()
            
            if existing_score:
                logger.info("Updating existing driver score")
                existing_score.driver_score = instance.driver_score
                existing_score.save()
            else:
                logger.info("Creating new skills score with driver score")
                instance.team1.skills_scores.create(
                    driver_score=instance.driver_score,
                    competition_event=instance.event,
                    autonomous_score=0
                )
        elif instance.stage in ['auto','coding']:
            logger.info("Setting autonomous scores")
            # Try to find an existing record with autonomous_score = 0
            existing_score = instance.team1.skills_scores.filter(
                autonomous_score=0
            ).first()
            
            if existing_score:
                logger.info("Updating existing autonomous score")
                existing_score.autonomous_score = instance.autonomous_score
                existing_score.save()
            else:
                logger.info("Creating new skills score with autonomous score")
                instance.team1.skills_scores.create(
                    autonomous_score=instance.autonomous_score,
                    driver_score=0,
                    competition_event=instance.event
                )
        elif instance.stage in ['vex_123','vex_123_manual','vex_123_coder_card','vex_123_programming']:
            logger.info("Setting vex 123 scores") 
            instance.team1.skills_scores.create(
                driver_score=instance.driver_score,
                autonomous_score=0,
                competition_event=instance.event
            )

