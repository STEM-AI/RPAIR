from rest_framework.permissions import IsAuthenticated 
from ...serializers import (
    OrganizationSerializer, 
    OrganizationMinimalSerializer,
    CreateUserWithOrganizationSerializer,
    ActiveOrganizationSerializer
)
from ...models import Organization 
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, ListCreateAPIView, UpdateAPIView
from rapair_db.permissions import IsSuperUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
import logging

logger = logging.getLogger(__name__)

class OrganizationRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrganizationSerializer
    lookup_field = 'id'
    queryset = (
        Organization.objects
        .prefetch_related('team_organization', 'contacts')
    )

    def perform_destroy(self, instance):
        logger.info(f"Deleting organization: {instance.name}")
        logger.info(f"Delete team organization: {instance.team_organization.all()}")
        instance.team_organization.all().delete()
        logger.info(f"Delete events: {instance.events.all()}")
        instance.events.all().delete()
        logger.info(f"Delete contacts: {instance.contacts.all()}")
        instance.contacts.all().delete()
        logger.info(f"Delete organization: {instance.name}")
        instance.delete()


class OrganizationListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Organization.objects.all()
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'email']
    filterset_fields = {
        'is_active': ['exact']
    }

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateUserWithOrganizationSerializer
        return OrganizationMinimalSerializer


class NonActiveOrganizationListView(ListAPIView):
    permission_classes = [IsSuperUser]
    serializer_class = OrganizationMinimalSerializer
    queryset = Organization.objects.filter(is_active=False)

class ActiveOrganizationView(UpdateAPIView):
    permission_classes = [IsSuperUser]
    serializer_class = ActiveOrganizationSerializer
    queryset = Organization.objects.all()
    lookup_field = 'id'
    lookup_url_kwarg = 'id'

    