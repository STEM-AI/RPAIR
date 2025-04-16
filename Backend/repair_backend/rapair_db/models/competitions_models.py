from django.db import models

class Competition(models.Model):
    id = models.AutoField(primary_key=True)

    COMPETITION_CHOICES = [
        ('vex_iq', 'VEX IQ'),
        ('vex_go', 'VEX GO'),
        ('vex_123', 'VEX_123'),
        ('programming', 'Programming')  
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
    age = models.CharField(max_length=255 , default='12-19')

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

    TEAMWORK = 'teamwork'
    DRIVER_IQ = 'driver_iq'
    DRIVER_GO = 'driver_go'
    AUTO = 'auto'
    CODING = 'coding'
    TEAMWORK_COOP = 'coop'
    TEAMWORK_FINAL = 'final'
    STAGE_CHOICES = (
        (TEAMWORK, 'Teamwork'),
        (DRIVER_IQ, 'Driver IQ'),
        (DRIVER_GO, 'Driver Go'),
        (AUTO,'Auto'),
        (TEAMWORK_COOP, 'Teamwork Coop'),
        (CODING, 'Coding'),
        (TEAMWORK_FINAL, 'Teamwork Final'),
    )
    stage = models.CharField(
        max_length=10 ,
        choices= STAGE_CHOICES , 
        default=TEAMWORK)
    

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['event', 'team1', 'team2' , 'time'],
                name='unique_game'
            )
        ]

    def __str__(self):
        return f"{self.team1} vs {self.team2} at {self.time}"
    

    


    