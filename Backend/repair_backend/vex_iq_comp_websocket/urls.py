from django.urls import path

from . import views


urlpatterns = [
    path("", views.room, name="index"),
    path("user/", views.user, name="room"),
    path("dashboard/", views.index, name="dashboard"),
    path("admin/", views.admin, name="admin"),
    path("news/", views.user_news, name="user_news"),
    path("notification/", views.user_notification, name="user_notification"),
    path("live-dashboard/", views.live_dashboard, name="live_dashboard"),  # This is for live dashboard page. To be replaced by actual dashboard page.  # TODO: replace this with actual dashboard view.  # TODO: add authentication for dashboard view.  # TODO: add permissions for dashboard view.  # TODO: add websockets for live dashboard updates.  # TODO: add real-time updates for dashboard.  # TODO: add more features for dashboard
    
]