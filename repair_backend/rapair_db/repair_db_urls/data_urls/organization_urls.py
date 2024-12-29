from django.urls import path

from ...views.data_views.organizatino_view import (
    OrganizationProfileView,
)

urlpatterns = [

    # Organization Profile APIs
    path('organization-profile/<str:organization_name>/', OrganizationProfileView.as_view(), name='organization-profile'),
]