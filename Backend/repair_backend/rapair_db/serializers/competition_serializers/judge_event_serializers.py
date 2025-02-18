from rest_framework import serializers
from ...models import JudgeForCompetitionEvent , CompetitionEvent , User



class JudgeForCompetitionEventSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='username'
    )
    competition_event = serializers.SlugRelatedField(
        queryset=CompetitionEvent.objects.all(),
        slug_field='name',
    )

    class Meta:
        model = JudgeForCompetitionEvent
        fields = ['user', 'competition_event']

    def validate(self, data):
        user = data['user']
        if not user.is_staff:
            raise serializers.ValidationError("User must be a judge.")
        return data

    def create(self, validated_data):
        user = validated_data['user']
        competition_event = validated_data['competition_event']
        judge_event = JudgeForCompetitionEvent.objects.create(user=user, competition_event=competition_event)
        return judge_event  # Return the created instance
    

class CompetitionEventSerializer(serializers.ModelSerializer):

    class Meta:
        model = CompetitionEvent
        fields = ['name', 'start_date', 'end_date', 'location']


class JudgeEventListSerializer(serializers.Serializer):
    competition_event = CompetitionEventSerializer()

    class Meta:
        fields = ['user','competition_event']
    