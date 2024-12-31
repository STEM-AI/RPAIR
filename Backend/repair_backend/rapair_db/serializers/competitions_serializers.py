from rest_framework import serializers
from ..models import Competition


class CompetitionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = ['name','start_date','end_date','location','type','rules','description']