from rest_framework import serializers
from ..models import Organization , OrganizationContact


    # id = models.AutoField(primary_key=True)
    # name = models.CharField(max_length=255, unique=True)
    # address = models.CharField(max_length=255)
    # type = models.CharField(max_length=255)

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id','name','address','type']
        extra_kwargs = {
            'name': {'required': True},
            'address': {'required': True},
            'type': {'required': True},
        }

    