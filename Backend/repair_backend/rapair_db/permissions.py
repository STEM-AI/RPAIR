from rest_framework.permissions import BasePermission
from rest_framework import permissions
from .models import Organization


class IsJudgeUser(BasePermission):
    """
    Allows access only to staff users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
    
class IsSuperUser(BasePermission):
    """
    Allows access only to superusers.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)

class IsOrganizationOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
            
        # Superusers can do anything
        if request.user.is_superuser:
            return True
            
        # Check if user owns any organization
        return Organization.objects.filter(owner=request.user, is_active=True).exists()

    def has_object_permission(self, request, view, obj):
        # Superusers can do anything
        if request.user.is_superuser:
            return True
            
        # Check if user owns the organization
        return obj.organization.owner == request.user