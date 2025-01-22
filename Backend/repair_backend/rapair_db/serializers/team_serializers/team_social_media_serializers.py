from rest_framework import serializers
from ...models import TeamSocialMedia

class TeamSocialMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamSocialMedia
        fields = ['platform', 'url']