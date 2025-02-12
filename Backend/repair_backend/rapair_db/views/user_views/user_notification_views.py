# views.py
from rest_framework import generics
from ...models import Notification
from ...serializers import NotificationSerializer
from rest_framework.permissions import IsAuthenticated
from ...utils.user_auth_utlis import UserLogin

class NotificationListCreateView(generics.ListCreateAPIView):
    """
    List all notification items or create a new notification item.
    """
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer


    def get_serializer_context(self):
        context = super().get_serializer_context()
        user = UserLogin.get_object(username=self.request.data.get('user_username'))
        context['user'] = user # Pass user for validation or custom logic
        return context
    

class MarkNotificationAsReadView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()
    def perform_update(self, serializer):
        serializer.save(is_read=True)
    