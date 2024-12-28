from rest_framework import serializers
from ..models import Organization , OrganizationContact , Team


class OrganizationContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationContact
        fields = ['phone_number']



class OrganizationSerializer(serializers.ModelSerializer):
    contact = serializers.SerializerMethodField()
    teams = serializers.SerializerMethodField()
    class Meta:
        model = Organization
        fields = ['name','address','email','type','contact' , 'teams'] 
        extra_kwargs = {
            'name': {'required': True},
            'address': {'required': True},
            'type': {'required': True},
        }

    def get_contact(self, obj):
        contact_obj = OrganizationContact.objects.filter(organization=obj).first()
        if contact_obj:
            return OrganizationContactSerializer(contact_obj).data
        else:
            return None
        
    def get_teams(self, obj):
        # TODO:
        pass
    