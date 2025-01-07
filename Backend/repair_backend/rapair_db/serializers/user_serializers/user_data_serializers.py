from django.core.exceptions import ValidationError
from rest_framework import serializers
from ...models import User
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','last_name','username', 'email', 'country' ,'password'  , 'phone_number' , 'date_of_birth' , 'address']

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