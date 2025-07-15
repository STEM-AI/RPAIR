from rest_framework import serializers
from rapair_db.models import CompetitionEvent

class CompetitionEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitionEvent
        fields = ['id','time_limit']