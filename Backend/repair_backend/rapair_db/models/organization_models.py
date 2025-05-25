from django.db import models
from ..validators import phone_validator

class Organization(models.Model):
    owner = models.ForeignKey('User', on_delete=models.CASCADE, related_name='organizations', null=False)
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    email = models.EmailField(unique=True , default=None)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} (Owner: {self.owner.username})"
    

class OrganizationContact(models.Model):
    id = models.AutoField(primary_key=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='contacts')
    phone_number = models.CharField(validators=[phone_validator] , max_length=255 , unique=True)
    
    def __str__(self):
        return f"Organization {self.organization.name} {self.phone_number}"