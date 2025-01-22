from rest_framework import serializers
from ...models import TeamPreviousCompetition

class TeamPreviousCompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamPreviousCompetition
        fields = ['name', 'year']