from django.db import models


class Organization(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    email = models.EmailField(unique=True , default=None)

    def __str__(self):
        return self.name
    

class OrganizationContact(models.Model):
    id = models.AutoField(primary_key=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='contacts')
    phone_number = models.CharField(max_length=255 , unique=True)
    
    def __str__(self):
        return f"Organization {self.organization.name} {self.phone_number}"