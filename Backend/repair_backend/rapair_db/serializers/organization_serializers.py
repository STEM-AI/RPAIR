from rest_framework import serializers
from ..models import Organization , OrganizationContact 

class OrganizationTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'type']  

class OrganizationContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationContact
        fields = ['phone_number']


class OrganizationMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id','name']

class OrganizationSerializer(serializers.ModelSerializer):
    contacts = OrganizationContactSerializer(many=True)
    teams = serializers.SerializerMethodField()
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'address', 'email', 'type', 'contacts', 'teams', 'owner'] 
        extra_kwargs = {
            'name': {'required': True},
            'address': {'required': True},
            'type': {'required': True},
            'contacts': {'required': True}
        }

    def create(self, validated_data):
        contacts_data = validated_data.pop('contacts')
        organization = self.Meta.model(**validated_data)
        organization.owner = self.context['request'].user
        organization.save()
        
        # Create contact
        for contact_data in contacts_data:
            OrganizationContact.objects.create(
                organization=organization,
                **contact_data
            )
        
        return organization

    def get_teams(self, obj):
        from ..serializers import TeamSerializer
        teams = obj.team_organization.all()
        # Implement filtering and ordering of teams based on the organization's type
        return TeamSerializer(teams, many=True).data
    

    def update(self, instance, validated_data):
        new_name = validated_data.get("name", instance.name)

        # Check if a different organization with the new name already exists
        if new_name != instance.name:
            existing_organization = Organization.objects.filter(name=new_name).first()
            if existing_organization:
                # Handle name conflict more gracefully: e.g., return an error message instead of deletion
                raise serializers.ValidationError({"name": "An organization with this name already exists."})

        # Proceed with regular update if no conflict
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    