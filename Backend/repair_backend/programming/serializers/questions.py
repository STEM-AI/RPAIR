from rest_framework import serializers
from programming.models import Question
from .answers import AnswerMinimalSerializer
from rapair_db.models import CompetitionEvent
class QuestionMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text','category','type']

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerMinimalSerializer(many=True)
    class Meta:
        model = Question
        fields = ['id', 'text','category','difficulty' , 'answers']

class ProgrammingCompetitionEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitionEvent
        fields = ['id','number_of_questions']