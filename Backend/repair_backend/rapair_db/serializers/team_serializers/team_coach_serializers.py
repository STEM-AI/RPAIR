from rest_framework import serializers
from ...models import TeamCoach


class TeamCoachSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamCoach
        fields = ['name','email','phone_number' , 'position']