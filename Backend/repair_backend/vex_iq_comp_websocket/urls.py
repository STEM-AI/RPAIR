from django.urls import path

from . import views


urlpatterns = [
    path("", views.room, name="index"),
    # path("<str:room_name>/", views.room, name="room"),
]