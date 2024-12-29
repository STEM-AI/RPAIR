from django.db import models
from .organization_models import Organization
from .competetions_models import Competition

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
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL , null=True, blank=True)
    competition = models.ForeignKey(Competition, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name
    
class TeamSponsor(models.Model):
    id = models.AutoField(primary_key=True)
    team_id = models.ForeignKey(Team, on_delete=models.CASCADE)
    sponsor_name = models.CharField(max_length=255)

    def __str__(self):
        return self.sponsor_name
    
class TeamSocialMedia(models.Model):
    id = models.AutoField(primary_key=True)
    team_id = models.ForeignKey(Team, on_delete=models.CASCADE)
    social_media_platform = models.CharField(max_length=255)
    social_media_url = models.URLField()

    def __str__(self):
        return f"Team {self.team_id} {self.social_media_platform}"


class TeamPreviousCompetition(models.Model):
    id = models.AutoField(primary_key=True)
    team_id = models.ForeignKey(Team, on_delete=models.CASCADE)
    competition_name = models.CharField(max_length=255)

    def __str__(self):
        return f"Team {self.team_id} previous competition {self.competition_name}"
    
class TeamCoach(models.Model):
    id = models.AutoField(primary_key=True)
    team_id = models.ForeignKey(Team, on_delete=models.CASCADE)
    coach_name = models.CharField(max_length=255)
    coach_email = models.EmailField(unique=True)
    coach_phone_number = models.CharField(max_length=255 , unique=True)
    coach_position = models.CharField(max_length=255)

    def __str__(self):
        return f"Team {self.team_id} coach {self.coach_name}"