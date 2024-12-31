from django.db import models
from .team_models import Team

class CompetitionGroup(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    score = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    competition_time = models.TimeField(null=True, blank=True)

    def __str__(self):
        return self.name
    
class TeamGroup(models.Model):
    id = models.AutoField(primary_key=True)
    team = models.ForeignKey(Team ,on_delete=models.CASCADE)
    group = models.ForeignKey(CompetitionGroup, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.team} - {self.group}"
