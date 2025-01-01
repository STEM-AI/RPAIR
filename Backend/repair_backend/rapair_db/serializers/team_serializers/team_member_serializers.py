from rest_framework import serializers
from ...models import TeamMember

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['name','email','phone_number']
