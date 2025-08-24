from rest_framework import serializers
from rapair_db.models import EventGame
class ProgrammingRankSerializer(serializers.ModelSerializer):
    team = serializers.CharField(source = 'team1.name',read_only=True)
    team_number = serializers.CharField(source = 'team1.team_number',read_only=True)
    class Meta:
        model = EventGame
        fields = ['team','score','team_number']

class ProgrammingGameSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventGame
        fields = ['id','completed']
        extra_kwargs = {
            'completed': {'read_only': True}
        }

    def update(self, instance, validated_data):
        instance.completed = True
        instance.save()
        return instance