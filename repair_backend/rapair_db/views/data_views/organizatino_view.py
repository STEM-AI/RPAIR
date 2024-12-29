from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated 
from rest_framework import status
from ...serializers.team_serializers import OrganizationSerializer
from ...models import Organization

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
