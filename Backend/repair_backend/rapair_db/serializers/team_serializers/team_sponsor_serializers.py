from rest_framework import serializers
from ...models import TeamSponsor

class TeamSponsorSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamSponsor
        fields = ['name', 'email']