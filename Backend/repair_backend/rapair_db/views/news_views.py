# views.py
from rest_framework import generics
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from ..models import News
from ..serializers import NewsSerializer

class NewsListCreateView(generics.ListCreateAPIView):
    queryset = News.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer

    def perform_create(self, serializer):
        # Save the new news item to the database
        news = serializer.save()

        # Broadcast the new news content to all clients via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'news_updates',  # WebSocket group name
            {
                'type': 'news_message',  # Handler method in the consumer
                'message': news.content, # The news content to broadcast
            }
        )