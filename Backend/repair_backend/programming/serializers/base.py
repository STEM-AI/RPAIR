from rest_framework import serializers
from rapair_db.models import EventGame
class ProgrammingRankSerializer(serializers.ModelSerializer):
    team = serializers.CharField(source = 'team1.name',read_only=True)
    class Meta:
        model = EventGame
        fields = ['team','score']