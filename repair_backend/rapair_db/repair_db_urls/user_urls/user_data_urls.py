from django.urls import path

from ...views.user_views.user_data_views import (
    UserProfileView,
    UserEditProfileView,
)




urlpatterns = [


    # User Profile APIs
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('edit-profile/', UserEditProfileView.as_view(), name='edit-profile'),
]