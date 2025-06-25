from django.db import models
from core.models import Schedule
from django.utils import timezone

class Competition(models.Model):
    id = models.AutoField(primary_key=True)

    COMPETITION_CHOICES = [
        ('vex_iq', 'VEX IQ'),
        ('vex_go', 'VEX GO'),
        ('vex_123', 'VEX_123'),
        ('programming', 'Programming'),
        ('arduino', 'Arduino'),
        ('flutter', 'Flutter'),
    ]
    name = models.CharField(
        max_length=255,
        unique=True , 
        choices= COMPETITION_CHOICES , 
        default = 'vex_iq'
        )
    type = models.CharField(max_length=255)
    description = models.TextField()
    rules = models.TextField()
    prize_distribution = models.TextField()
    image = models.CharField(max_length=255 , default=None , blank=True , null=True)

    #Additional Notes
    # Static Files in Production: In production, ensure your static files are collected using:

    # bash
    # ￼Copy code
    # python manage.py collectstatic
    # And configure a web server (e.g., Nginx or Apache) to serve the static files.

    def get_image_url(self):
        return f"/static/competition_image/{self.image}"

    def __str__(self):
        return self.name
    

class CompetitionEvent(models.Model):
    id = models.AutoField(primary_key=True)
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE , related_name='competition_event')
    name = models.CharField(max_length=255 , blank=True, null=True , default=None)
    start_date = models.DateField()
    end_date = models.DateField()
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    fees = models.IntegerField(default=0)
    age = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_live = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    number_of_questions = models.IntegerField(default=0)
    time_limit = models.IntegerField(default=120)
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE, related_name='events', null=True, blank=True)

    MINI_EVENT = 'Mini'
    SMALL_EVENT = 'Small'
    REGIONAL_EVENT = 'Regional'
    NATIONAL_EVENT = 'National'
    INTERNATIONAL_EVENT = 'International'
    CATEGORY_CHOICES = [
        ( MINI_EVENT, 'Mini Event'),
        ( SMALL_EVENT, 'Small Event'),
        ( REGIONAL_EVENT, 'Regional Event'),
        ( NATIONAL_EVENT, 'National Event'),
        ( INTERNATIONAL_EVENT, 'International Event'),
    ]
    category = models.CharField(
        max_length=255,
        choices= CATEGORY_CHOICES , 
        default = MINI_EVENT
        )


    def __str__(self):
        return self.name
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['competition', 'start_date' , 'location'],
                name='unique_event'
            )
        ]

    def save(self, *args, **kwargs):
        today = timezone.now().date()
        if self.start_date > self.end_date:
            raise ValueError("Start date cannot be greater than end date")
        if self.start_date < today:
            raise ValueError("Start date cannot be in the past")
        if self.end_date < today:
            raise ValueError("End date cannot be in the past")
        if self.start_date > self.end_date:
            raise ValueError("Start date cannot be greater than end date")
        if today > self.start_date and today < self.end_date:
            self.is_live = True
        else:
            self.is_live = False
        if today > self.end_date:
            self.is_completed = True
        else:
            self.is_completed = False
        if today < self.start_date:
            self.is_active = True
        else:
            self.is_active = False
        super().save(*args, **kwargs)

class EventGame(models.Model):
    id = models.AutoField(primary_key=True)
    event = models.ForeignKey(CompetitionEvent, on_delete=models.CASCADE , related_name='event_game')
    team1  = models.ForeignKey('Team' , on_delete=models.CASCADE , related_name='team1')
    team2 = models.ForeignKey('Team' , on_delete=models.SET_NULL , related_name='team2' , null=True , blank=True) 
    score = models.IntegerField(null=True, blank=True , default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    time_taken = models.FloatField(default=0)
    completed = models.BooleanField(default=False)
    time = models.TimeField()
    is_active = models.BooleanField(default=False)
    is_paused = models.BooleanField(default=False)
    paused_time = models.FloatField(default=15)
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE , null=True , blank=True)
    duration = models.IntegerField(default=60)
    timer_task_id = models.CharField(max_length=255, null=True, blank=True)

    STAGE_CHOICES = (
        ('teamwork', 'Teamwork'),
        ('driver_iq', 'Driver IQ'),
        ('driver_go', 'Driver Go'),
        ('auto','Auto'),
        ('coop', 'Teamwork Coop'),
        ('coding', 'Coding'),
        ('final', 'Teamwork Final'),
        ('vex_123', 'VEX 123'),
        ('programming', 'Programming'),
    )
    stage = models.CharField(
        max_length=15 ,
        choices= STAGE_CHOICES , 
        default='teamwork')
    

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['event', 'team1', 'team2' , 'time'],
                name='unique_game'
            )
        ]

    def __str__(self):
        return f"{self.team1} vs {self.team2} at {self.time}"

class JudgeForCompetitionEvent(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    competition_event = models.ForeignKey(CompetitionEvent, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        # Ensure the user is a staff member
        if not self.user.is_staff:
            raise ValueError("Must be a Judge member")

        super().save(*args, **kwargs)  # Call the parent save method

    class Meta:
        unique_together = ('user', 'competition_event')
    def __str__(self):
        return f"{self.user.username} - {self.competition_event.name}"

    


    