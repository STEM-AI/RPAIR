from django.urls import path

from ..views.organization_views.organization_view import (
    OrganizationProfileView,
    OrganizationEditProfileView,
    CreateOrganizationView,
    DeleteOrganizationView ,
    ListOrganizationsView
)

urlpatterns = [
    
    # Organization Profile APIs
    path('create-organization/', CreateOrganizationView.as_view(), name='create-organization'),
    path('organization-list/', OrganizationProfileView.as_view(), name='organization-list'),
    path('organization-profile/<str:organization_name>/', OrganizationProfileView.as_view(), name='organization-profile'),
    path('edit-organization-profile/<str:organization_name>/', OrganizationEditProfileView.as_view(), name='edit-organization-profile'),
    path('delete-organization/<str:organization_name>/', DeleteOrganizationView.as_view(), name='delete-organization'),
    path('list-organizations/', ListOrganizationsView.as_view(), name='list-organizations'),
]