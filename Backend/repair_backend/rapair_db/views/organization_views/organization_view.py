from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated 
from ...permissions import IsJudgeUser
from rest_framework import status
from ...serializers import OrganizationSerializer
from ...models import Organization 


class CreateOrganizationView(APIView):
    permission_classes = [IsJudgeUser]
    def post(self, request):
        serializer = OrganizationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrganizationProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request , organization_name=None):
        if organization_name is None:
            return Response({"error": "Organization name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        organization = (
            Organization.objects.filter(name=organization_name)
            .prefetch_related('contacts', 'team_set__competition')
            .first()
            )
        
        if organization is None:
            return Response({"error": "Organization not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = OrganizationSerializer(organization)
        return Response(serializer.data , status=status.HTTP_200_OK)
    
class OrganizationEditProfileView(APIView):
    permission_classes = [IsJudgeUser]

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
    permission_classes = [IsJudgeUser]
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
    

class ListOrganizationsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        organizations = Organization.objects.all()
        serializer = OrganizationSerializer(organizations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


