from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated 
from rest_framework import status
from ...serializers import (
    OrganizationSerializer, 
    OrganizationMinimalSerializer,
    CreateUserWithOrganizationSerializer,
    ActiveOrganizationSerializer
)
from ...models import Organization 
from rest_framework.generics import ListAPIView , RetrieveAPIView , UpdateAPIView
from rapair_db.permissions import IsSuperUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
import logging

logger = logging.getLogger(__name__)

# class CreateOrganizationView(APIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = OrganizationSerializer
#     def post(self, request):
#         serializer = OrganizationSerializer(data=request.data, context={'request': request})
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class CreateOrganizationWithUserView(APIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = CreateOrganizationWithUserSerializer
    
#     def post(self, request):
#         serializer = CreateOrganizationWithUserSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateUserWithOrganizationView(APIView):
    serializer_class = CreateUserWithOrganizationSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            logger.info(f"User created: {user}")
            logger.info(f"User data: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrganizationProfileView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrganizationSerializer
    lookup_field = 'name'
    queryset = (
        Organization.objects
        .prefetch_related('team_organization' , 'contacts')
        )

    
class OrganizationEditProfileView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrganizationSerializer

    def patch(self, request, organization_name):
        if not organization_name:
            return Response({"error": "Organization name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        organization = Organization.objects.filter(name=organization_name).first()
        if not organization:
            return Response({"error": "Organization not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = OrganizationSerializer(organization, data=request.data, partial=True)
        if serializer.is_valid():
            updated_organization = serializer.save()
            return Response(OrganizationSerializer(updated_organization).data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteOrganizationView(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self, request ,organization_name ):
        new_organization = request.data.get('new_organization_info')
        if not new_organization:
            return Response({"error": "New Organization information is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not organization_name:
            return Response({"error": "Organization name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        organization = Organization.objects.filter(name=organization_name).first()
        if not organization:
            return Response({"error": "Organization not found"}, status=status.HTTP_404_NOT_FOUND)
        
        organization.new_organization = new_organization
        
        organization.delete()
        return Response({"message": "Organization deleted successfully"}, status=status.HTTP_200_OK)
    

class ListOrganizationsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrganizationMinimalSerializer
    queryset = Organization.objects.all()
    filter_backends = [SearchFilter,DjangoFilterBackend]
    search_fields = ['name', 'email']
    filterset_fields ={
        'is_active':['exact']
    }
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

    