from rest_framework import serializers
from programming.models import Answer

class AnswerMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text']

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'