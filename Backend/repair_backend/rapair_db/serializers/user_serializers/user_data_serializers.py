from django.core.exceptions import ValidationError
from rest_framework import serializers
from ...models import User
from django.contrib.auth.password_validation import validate_password
from ..competition_serializers.judge_event_serializers import JudgeEventListSerializer
from ...serializers.organization_serializers import OrganizationMinimalSerializer
import logging

logger = logging.getLogger(__name__)

class UserSerializer(serializers.ModelSerializer):
    organization = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['first_name','last_name','username', 'email', 'country' ,'password'  , 'phone_number' , 'date_of_birth' , 'address', 'organization']

        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_password(self, value):
    
        """
        This method ensures password validation with custom rules.
        """
        try:
            # Ensure password validation triggers custom validators
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        return value

    def create(self, validated_data):

        password = validated_data.pop('password' , None)
        instance = self.Meta.model(**validated_data)

        if password is not None:
            instance.set_password(password)

        instance.save()

        return instance
    

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # If a password is provided, hash it and set it
        if password is not None:
            instance.set_password(password)

        instance.save()

        return instance
    
    def get_organization(self, obj):
        logger.info(f"Organization:")
        if obj.organizations.all():
            logger.info(f"Organization: {obj.organizations.all()}")
            logger.info(f"Organization Serializer: {OrganizationMinimalSerializer(obj.organizations.all(), many=True).data}")
            return OrganizationMinimalSerializer(obj.organizations.all(), many=True).data
        return None

class UserEditProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','last_name','profile_name', 'email', 'country' ]

    def to_internal_value(self, data):
        # Get the allowed fields from the serializer
        allowed_fields = set(self.fields.keys())
        # Get the fields sent in the request data
        input_fields = set(data.keys())

        # Check if there are any extra fields
        extra_fields = input_fields - allowed_fields
        if extra_fields:
            raise serializers.ValidationError({
                "error": f"Invalid field(s): {', '.join(extra_fields)}"
            })

        # Continue normal processing if no extra fields
        return super().to_internal_value(data)
    
# Serializer for the request body
class UserLoginRequestSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

# Serializer for the response
class TokenResponseSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    access = serializers.CharField()

class ErrorResponseSerializer(serializers.Serializer):
    errors = serializers.DictField(
        child=serializers.CharField(), 
        help_text="A dictionary where keys are field names and values are error messages."
    )
    
    

class JudgeListSerializer(serializers.ModelSerializer):
    judging_events = JudgeEventListSerializer(source='judgeforcompetitionevent_set', many=True, read_only=True)

    class Meta:
        model = User
        fields = ['username', 'judging_events']