from django.db import models
from .organization_models import Organization
from .competitions_models import Competition

class Team(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255 , unique=True)
    robot_name = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey('User', blank=True , on_delete=models.CASCADE)
    type = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    competition_date = models.DateField(null=True, blank=True)
    team_leader_name = models.CharField(max_length=255)
    team_leader_email = models.EmailField(unique=True)
    team_leader_phone_number = models.CharField(max_length=255 , unique=True)
    score = models.IntegerField(null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL , null=True, blank=True )
    competition = models.ForeignKey(Competition, on_delete=models.SET_NULL, null=True, blank=True )

    def __str__(self):
        return self.name
    
class TeamSponsor(models.Model):
    id = models.AutoField(primary_key=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE , related_name="sponsors")
    name = models.CharField(max_length=255)
    #TODO:
    email = models.EmailField(max_length=255 , unique=True , default='@example.com')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['team', 'name'],
                name='unique_sponsor'
            )
        ]

    def __str__(self):
        return self.name
    
class TeamSocialMedia(models.Model):
    id = models.AutoField(primary_key=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE,related_name="social_media")
    FACEBOOK = "facebook"
    INSTAGRAM = "instagram"
    TWITTER = "twitter"
    PLATFORM_CHOICES = [
        (FACEBOOK, "facebook"),
        (INSTAGRAM, "instagram"),
        (TWITTER , "twitter")
    ]
    platform = models.CharField(
        max_length=255,
        choices=PLATFORM_CHOICES,
        default=FACEBOOK
    )

    url = models.URLField()


    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['team', 'platform' , 'url'],
                name='unique_platform'
            )
        ]

    def __str__(self):
        return f"Team {self.team} {self.platform}"


class TeamPreviousCompetition(models.Model):
    id = models.AutoField(primary_key=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE,related_name="previous_competition")
    name = models.CharField(max_length=255)
    year = models.IntegerField(null=True, blank=True)

    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['team', 'name' ],
                name='unique_competition'
            )
        ]
        
    def __str__(self):
        return f"Team {self.team} previous competition {self.name}"

class TeamCoach(models.Model):
    id = models.AutoField(primary_key=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE , related_name="coach")
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=255 , unique=True)
    PRIMARY = "primary"
    SECONDARY = "secondary"
    POSITION_CHOICES = [
        (PRIMARY, "Primary"),
        (SECONDARY, "Secondary"),
    ]
    position = models.CharField(
        max_length=255,
        choices=POSITION_CHOICES,
        default=PRIMARY
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['team', 'name' ],
                name='unique_coach'
            )
        ]

    def __str__(self):
        return f"Team {self.team} coach {self.name}"