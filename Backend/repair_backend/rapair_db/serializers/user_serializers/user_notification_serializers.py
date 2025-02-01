from rest_framework import serializers
from ...models import Notification



class NotificationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Notification
        fields = ['id','content', 'created_at', 'is_read' , 'user']

        extra_kwargs = {
            'is_read': {'read_only': True},  # Mark is_read as read-only
        }

    def create(self, validated_data):
        user = self.context['user']

        notification = Notification.objects.create(
            user=user,
            **validated_data
        )

        return notification