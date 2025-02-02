from django.urls import path

from ...views.user_views.user_data_views import (
    UserProfileView,
    UserEditProfileView,
)

from ...views.user_views.user_notification_views import (
    NotificationListCreateView,
    MarkNotificationAsReadView,
)




urlpatterns = [


    # User Profile APIs
    path('data/profile/', UserProfileView.as_view(), name='user-profile'),
    path('data/edit-profile/', UserEditProfileView.as_view(), name='edit-profile'),
    # Notification APIs
    path('notification/', NotificationListCreateView.as_view(), name='notification-list-create'),
    path('notification/mark-as-read/<int:pk>/', MarkNotificationAsReadView.as_view(), name='mark-notification-as-read'),
]