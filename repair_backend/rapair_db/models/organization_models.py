from django.db import models


class Organization(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=255)
    type = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    

class OrganizationContact(models.Model):
    id = models.AutoField(primary_key=True)
    organization_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=255 , unique=True)