from django.db import models
from django.contrib.auth.models import AbstractUser
from .group_models import CompetitionGroup
from ..validators import phone_validator


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    country = models.CharField(max_length=255, blank=True , null=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    address = models.CharField(max_length = 255, blank=True , null=True)
    date_of_birth = models.DateField(blank=True , null=True)
    phone_number = models.CharField(validators=[phone_validator] , max_length = 255, unique=True)
    email = models.EmailField(unique=True)
    google_verified = models.BooleanField(default=False)


    def __str__(self):
        return self.username

class JudgeUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    group = models.ForeignKey(CompetitionGroup, on_delete=models.CASCADE, null=True)
    def save(self, *args, **kwargs):
        # Ensure the user is marked as staff when a judge is created or updated
        if not self.user.is_staff:  # Only change if it's not already set
            self.user.is_staff = True
            self.user.save()

        super().save(*args, **kwargs)  # Call the parent save method

    def __str__(self):
        return self.user.username