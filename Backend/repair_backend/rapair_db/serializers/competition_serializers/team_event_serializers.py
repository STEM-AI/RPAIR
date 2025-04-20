from rest_framework import serializers
from rapair_db.models import Team

class TeamNonTechScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['eng_notebook_score','interview_score','inspect_score']