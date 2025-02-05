from django.db import models
from .organization_models import Organization
from .competitions_models import CompetitionEvent
from ..validators import phone_validator

class Team(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255 , unique=True)
    robot_name = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey('User', blank=True , on_delete=models.CASCADE)
    type = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    team_leader_name = models.CharField(max_length=255)
    team_leader_email = models.EmailField(unique=True)
    team_leader_phone_number = models.CharField(validators=[phone_validator] , max_length=255 , unique=True)
    interview_score = models.IntegerField(null=True, blank=True,default=0)
    inspect_score = models.IntegerField(null=True, blank=True,default=0)
    eng_note_book_score = models.IntegerField(null=True, blank=True,default=0)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL , null=True, blank=True  , related_name='organization')
    competition_event = models.ForeignKey(CompetitionEvent, on_delete=models.SET_NULL, null=True, blank=True , related_name='teams')
    note = models.CharField(max_length=255 , null=True, blank=True , default='')

    def __str__(self):
        return self.name
    
class TeamworkTeamScore(models.Model):
    id = models.AutoField(primary_key=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE , related_name="teamwork_scores")
    score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.team.name} - Average Teamwork Score: {self.get_average_score()}"
    
class SkillsTeamScore(models.Model):
    id = models.AutoField(primary_key=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE , related_name="skills_scores")
    autonomous_score = models.IntegerField(default=0)
    driver_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    
    def __str__(self):
        return f"{self.team.name} - Average Skills Score: {self.get_average_score()}"
    

class TeamSponsor(models.Model):
    id = models.AutoField(primary_key=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE , related_name="sponsors")
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255 , unique=True )

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
        (FACEBOOK, "Facebook"),
        (INSTAGRAM, "Instagram"),
        (TWITTER , "Twitter")
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
    VEX_IQ = "VEX_IQ"
    ROV = "ROV"
    ROBOCUP = "ROBOCUP"
    COMPETITION_CHOICES = [
        (VEX_IQ, "VEX_IQ"),
        (ROV, "ROV"),
        (ROBOCUP , "ROBOCUP")
    ]
    name = models.CharField(
        max_length=255,
        choices=COMPETITION_CHOICES,
        default=VEX_IQ
    )
    year = models.DateField()

    
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
    phone_number = models.CharField(validators=[phone_validator] , max_length=255 , unique=True)
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
    
class TeamMember(models.Model):
    id = models.AutoField(primary_key=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="members")
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(validators=[phone_validator] , max_length=255 , unique=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['team', 'name' ],
                name='unique_member'
            )
        ]
    
    def __str__(self):
        return f"Team {self.team} member {self.name}"