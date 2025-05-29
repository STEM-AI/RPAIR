from rest_framework import serializers
from ...models import JudgeForCompetitionEvent , CompetitionEvent , User



class JudgeForCompetitionEventSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='username'
    )

    class Meta:
        model = JudgeForCompetitionEvent
        fields = ['user']

    def validate(self, data):
        user = data['user']
        if not user.is_staff:
            raise serializers.ValidationError("User must be a judge.")
        return data
   

class CompetitionEventSerializer(serializers.ModelSerializer):
    competition_name = serializers.CharField(source='competition.name')
    class Meta:
        model = CompetitionEvent
        fields = ['id','name', 'start_date', 'end_date', 'location','competition_name']


class JudgeEventListSerializer(serializers.ModelSerializer):
    competition_event = CompetitionEventSerializer()  # Serialize the related event properly

    class Meta:
        model = JudgeForCompetitionEvent  # Specify the correct model
        fields = ['competition_event']
    