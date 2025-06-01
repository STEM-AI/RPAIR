from rest_framework import serializers
from programming.models import Question
from .answers import AnswerMinimalSerializer
class QuestionMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text','category']

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerMinimalSerializer(many=True)
    class Meta:
        model = Question
        fields = ['id', 'text','category','difficulty' , 'answers']