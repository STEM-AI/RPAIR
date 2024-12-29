from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated ,IsJudgeUser
from rest_framework import status
from ...serializers import OrganizationSerializer
from ...models import Organization , Team


class CreateOrganizationView(APIView):
    permission_classes = [IsJudgeUser]
    def post(self, request):
        print("Organization information"  , request.data)
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
        organization = Organization.objects.filter(name=organization_name).first()
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
    


