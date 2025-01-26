from django.core.management.base import BaseCommand
from django.utils import timezone
from rapair_db.models import CompetitionEvent
from django.db.utils import IntegrityError
from rapair_db.utils import event_utils

class Command(BaseCommand):
    help = "Create a schedule for events one week before their start date."
    request = {
        'stage': 'start',
        'time': '9:00'
    }

    def handle(self, *args, **kwargs):
        self.stdout.write("Running schedule command")
        # Get events that start one week from now
        one_week_from_today = timezone.now().date() + timezone.timedelta(weeks=1)
        self.stdout.write(f"one_week_from_today: {one_week_from_today}")
        events = CompetitionEvent.objects.filter(start_date=one_week_from_today)
        if not events.exists():
            self.stdout.write(self.style.WARNING("No events found for scheduling."))
            return

        for event in events:
            try:
                self.stdout.write(f"Creating schedule for event: {event.name}")
                event_utils.create_schedule(event=event , request=self.request)
                self.stdout.write(self.style.SUCCESS(f"Schedule created for event: {event.name}"))
            except IntegrityError as e:
                self.stdout.write(self.style.ERROR(f"Integrity error for event {event.name}: {str(e)}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error creating schedule for event {event.name}: {str(e)}"))