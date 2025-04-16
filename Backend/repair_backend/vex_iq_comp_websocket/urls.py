from django.urls import path

from . import views


urlpatterns = [
    path("game/", views.game_control, name="index"),
    path("game/user/", views.user_game, name="room"),
    path("dashboard/", views.event_live_dashboard, name="dashboard"),
    path("admin-news/", views.admin_send_news, name="admin"),
    path("news/", views.user_news, name="user_news"),
    path("notification/", views.user_notification, name="user_notification"),
    path("live-dashboard/", views.live_dashboard, name="live_dashboard"),  
]