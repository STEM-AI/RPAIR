from django.db import models

class Competition(models.Model):
    id = models.AutoField(primary_key=True)
    VEX_IQ = 'vex_iq'
    ROV = 'rov'
    ROBOCUP = 'robocup'
    ROBOTICS = 'robotics'
    COMPETITION_CHOICES = [
        (VEX_IQ, 'VEX IQ'),
        (ROV, 'ROV'),
        (ROBOCUP, 'ROBOCUP'),
        (ROBOTICS, 'Robotics')  
    ]
    name = models.CharField(
        max_length=255,
        unique=True , 
        choices= COMPETITION_CHOICES , 
        default = VEX_IQ
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
    team2 = models.ForeignKey('Team' , on_delete=models.CASCADE , related_name='team2')
    score = models.IntegerField(null=True, blank=True , default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    time = models.TimeField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['event', 'team1', 'team2' , 'time'],
                name='unique_game'
            )
        ]

    def __str__(self):
        return f"{self.team1} vs {self.team2} at {self.time}"
    


    