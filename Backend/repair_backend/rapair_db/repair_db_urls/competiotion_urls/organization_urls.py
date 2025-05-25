from django.urls import path

from ...views.organization_views.organization_view import (
    OrganizationProfileView,
    OrganizationEditProfileView,
    CreateOrganizationView,
    CreateOrganizationWithUserView,
    CreateUserWithOrganizationView,
    DeleteOrganizationView,
    ListOrganizationsView
)

urlpatterns = [
    
    # Organization Profile APIs
    path('create-organization/', CreateOrganizationView.as_view(), name='create-organization'),
    path('create-organization-with-user/', CreateOrganizationWithUserView.as_view(), name='create-organization-with-user'),
    path('create-user-with-organization/', CreateUserWithOrganizationView.as_view(), name='create-user-with-organization'),
    path('<str:name>/organization-profile/', OrganizationProfileView.as_view(), name='organization-profile'),
    path('<str:organization_name>/edit-organization-profile/', OrganizationEditProfileView.as_view(), name='edit-organization-profile'),
    path('<str:organization_name>/delete-organization/', DeleteOrganizationView.as_view(), name='delete-organization'),
    path('list-organizations/', ListOrganizationsView.as_view(), name='list-organizations'),
]