from django.db import models
from django.db import transaction

# Create your models here.
class Schedule(models.Model):
    event = models.ForeignKey('rapair_db.CompetitionEvent', on_delete=models.CASCADE)
    time = models.TimeField()
    stage = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.event.name} - {self.stage} at {self.time}"
    class Meta:
        verbose_name = "Schedule"
        verbose_name_plural = "Schedules"
        ordering = ['time']
        constraints = [
            models.UniqueConstraint(
                fields=['event', 'time'],
                name='unique_schedule'
            )
        ]
    def save(self, *args, **kwargs):
        # Check if the schedule already exists
        if Schedule.objects.filter(event=self.event, time=self.time, stage=self.stage).exists():
            raise ValueError("Schedule with this event, time, and stage already exists.")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """
        Override the delete method to delete all related games before deleting the schedule.
        """
        with transaction.atomic():
            self.eventgame_set.all().delete()
            super().delete(*args, **kwargs)