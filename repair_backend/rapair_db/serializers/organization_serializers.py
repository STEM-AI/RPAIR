from rest_framework import serializers
from ..models import Organization , OrganizationContact 

class OrganizationTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['name', 'type']  # Include only the necessary fields


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
        from ..serializers import TeamSerializer
        teams = obj.team_set.all()
        # Implement filtering and ordering of teams based on the organization's type
        return TeamSerializer(teams, many=True).data
    