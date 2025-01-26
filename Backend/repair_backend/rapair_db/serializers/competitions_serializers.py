from rest_framework import serializers
from ..models import Competition 

class CompetitionsSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Competition
        fields = ['name','type','rules','description','image', 'image_url']

        extra_kwargs = {
            'image': {'write_only': True},
        }

    def get_image_url(self, obj):
        request = self.context.get('request')
        image_url = obj.get_image_url()
        if request:
            return request.build_absolute_uri(image_url)
        return image_url
    