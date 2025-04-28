from django.core.management.base import BaseCommand
from django.utils import timezone
from rapair_db.models import CompetitionEvent

class Command(BaseCommand):
    help = 'Updates the status (is_active and is_live) of all competition events'

    def handle(self, *args, **options):
        today = timezone.now().date()
        events = CompetitionEvent.objects.all()
        
        for event in events:
            # Update is_active
            if today < event.start_date:
                event.is_active = True
            else:
                event.is_active = False
                
            # Update is_live
            if event.start_date <= today <= event.end_date:
                event.is_live = True
            else:
                event.is_live = False
                
            event.save()
            
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {events.count()} events')) 