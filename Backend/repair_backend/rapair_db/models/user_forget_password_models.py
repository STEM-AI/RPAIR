from django.db import models


from .user_models import User

# Create your models here.



class VerificationCode(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user_id', 'id'],
                name='unique_code'
            )
        ]

    def __str__(self):
        return f"The verification code for {self.user_id} is {self.code}"