from rest_framework import serializers
from ..models import Organization , OrganizationContact 
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class OrganizationTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'type']  

class OrganizationContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationContact
        fields = ['phone_number']


class OrganizationMinimalSerializer(serializers.ModelSerializer):
    has_events = serializers.SerializerMethodField()
    has_teams = serializers.SerializerMethodField()
    class Meta:
        model = Organization
        fields = ['id','name','is_active','has_events','has_teams']

    def get_has_events(self, obj):
        return obj.events.count() > 0

    def get_has_teams(self, obj):
        return obj.team_organization.count() > 0

class CreateUserWithOrganizationSerializer(serializers.ModelSerializer):
    organization = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    contacts = OrganizationContactSerializer(many=True, write_only=True)
    
    # Organization fields
    name = serializers.CharField(write_only=True, required=True)
    type = serializers.CharField(write_only=True, required=True)
    address = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'first_name', 'last_name',
            'phone_number', 'address', 'date_of_birth', 'country', 'organization',
            'name', 'type', 'contacts'
        ]
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'phone_number': {'required': True},
            'contacts': {'required': True}
        }

    def validate(self, attrs):
        logger.info(f"Validating user with organization: {attrs}")
        return attrs

    def get_organization(self, obj):
        try:
            organization = obj.organizations.first()
            if organization:
                return {
                    'id': organization.id,
                    'name': organization.name,
                    'type': organization.type,
                    'address': organization.address,
                    'email': organization.email,
                    'contacts': list(organization.contacts.values('phone_number'))
                }
            return None
        except Exception as e:
            logger.error(f"Error getting organization: {e}")
            return None

    @transaction.atomic
    def create(self, validated_data):
        logger.info(f"Creating user with organization: {validated_data}")
        # Extract organization and contact data
        contacts_data = validated_data.pop('contacts')
        organization_data = {
            'name': validated_data.pop('name'),
            'type': validated_data.pop('type'),
            'address': validated_data.pop('address'),
            'email': validated_data['email']
        }
        
        # Create user
        password = validated_data.pop('password')
        logger.info(f"Password: {password}")
        logger.info(f"Validated data after pop: {validated_data}")
        user = User.objects.create_user(
            **validated_data,
            password=password
        )
        logger.info(f"User created: {user}")
        
        # Create organization
        organization = Organization.objects.create(
            **organization_data,
            owner=user
        )
        logger.info(f"Organization created: {organization}")
        # Create contacts
        for contact_data in contacts_data:
            OrganizationContact.objects.create(
                organization=organization,
                **contact_data
            )
        logger.info(f"Contacts created: {contacts_data}")
        return user
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        organization = instance.organizations.first()
        if organization:
            data['organization'] = {
                'id': organization.id,
                'name': organization.name,
                'type': organization.type,
                'address': organization.address,
                'email': organization.email,
                'contacts': list(organization.contacts.values('phone_number'))
            }
        logger.info(f"Data: {data}")
        return data

class CreateOrganizationWithUserSerializer(serializers.ModelSerializer):
    contacts = OrganizationContactSerializer(many=True)
    user_id = serializers.IntegerField(write_only=True, required=True)
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'address', 'email', 'type', 'contacts', 'user_id']
        extra_kwargs = {
            'name': {'required': True},
            'address': {'required': True},
            'type': {'required': True},
            'contacts': {'required': True},
            'user_id': {'required': True}
        }

    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this ID does not exist.")

    def create(self, validated_data):
        contacts_data = validated_data.pop('contacts')
        user_id = validated_data.pop('user_id')
        
        organization = self.Meta.model(**validated_data)
        organization.owner_id = user_id
        organization.save()
        
        # Create contact
        for contact_data in contacts_data:
            OrganizationContact.objects.create(
                organization=organization,
                **contact_data
            )
        
        return organization

class OrganizationSerializer(serializers.ModelSerializer):
    contacts = OrganizationContactSerializer(many=True)
    teams = serializers.SerializerMethodField()
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'address', 'email', 'type', 'contacts', 'teams', 'owner', 'is_active'] 
        extra_kwargs = {
            'name': {'required': True},
            'address': {'required': True},
            'type': {'required': True},
            'contacts': {'required': True},
            'is_active': {'required': False, 'read_only': True}
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
        return TeamSerializer(teams, many=True).data

    def update(self, instance, validated_data):
        new_name = validated_data.get("name", instance.name)

        if new_name != instance.name:
            existing_organization = Organization.objects.filter(name=new_name).first()
            if existing_organization:
                raise serializers.ValidationError({"name": "An organization with this name already exists."})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class ActiveOrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'is_active'] 
        read_only_fields = ['id', 'name','is_active']

    def update(self, instance, validated_data):
        instance.is_active = True
        instance.save()
        return instance
