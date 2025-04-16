from rest_framework import serializers
from rapair_db.models import Team

class TeamInterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['interview_score','id']

        extra_kwargs = {
            'name': {'required': False},
            'interview_score': {'required': True},
            'id': {'required': True}
        }

    def update(self, instance, validated_data):
        # Update the instance with the validated data
        instance.interview_score = validated_data.get('interview_score', instance.interview_score)
        instance.save()
        return instance
    
