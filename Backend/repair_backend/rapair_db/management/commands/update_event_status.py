from django.core.management.base import BaseCommand
from django.utils import timezone
from rapair_db.models import CompetitionEvent
import logging
logger = logging.getLogger(__name__)
class Command(BaseCommand):
    help = 'Updates the status (is_active and is_live) of all competition events'

    def handle(self, *args, **options):
        today = timezone.now().date()
        events = CompetitionEvent.objects.all()
        
        for event in events:
            logger.info(f"event.name: {event.name}")
            logger.info(f"event.start_date: {event.start_date}")
            logger.info(f"event.end_date: {event.end_date}")
            logger.info(f"today: {today}")
            # Update is_active
            if today <= event.start_date:
                logger.info("Event is active")
                event.is_active = True
            else:
                logger.info("Event is not active")
                event.is_active = False
                
            # Update is_live
            if today >= event.start_date and today <= event.end_date:
                logger.info("Event is live")
                event.is_live = True
            else:
                logger.info("Event is not live")
                event.is_live = False
                
            # Update is_completed
            if today >= event.end_date:
                logger.info("Event is completed")
                event.is_completed = True
            else:
                logger.info("Event is not completed")
                event.is_completed = False
                
            event.save()
            
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {events.count()} events')) 