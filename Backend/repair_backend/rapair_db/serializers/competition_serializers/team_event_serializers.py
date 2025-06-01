from rest_framework import serializers
from rapair_db.models import TeamCompetitionEvent
import logging
logger = logging.getLogger(__name__)
class TeamNonTechScoreSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='team.id',read_only=True)
    name = serializers.CharField(source='team.name',read_only=True)
    class Meta:
        model = TeamCompetitionEvent
        fields = ['id','name','eng_notebook_score','interview_score','inspect_score']
