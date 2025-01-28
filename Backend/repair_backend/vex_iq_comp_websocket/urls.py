from django.urls import path

from . import views


urlpatterns = [
    path("", views.room, name="index"),
    path("user/", views.user, name="room"),
    path("dashboard/", views.index, name="dashboard"),
    path("admin/", views.admin, name="admin"),
    path("news/", views.user_news, name="user_news"),
]