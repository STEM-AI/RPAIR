from django.urls import path

from ...views.organization_views.organization_view import (
    OrganizationRetrieveUpdateDestroyView,
    OrganizationListCreateView,
)

urlpatterns = [
    
    # Organization APIs
    path('', OrganizationListCreateView.as_view(), name='organization-list-create'),
    path('<int:id>/', OrganizationRetrieveUpdateDestroyView.as_view(), name='organization-retrieve-update-destroy'),
    
]