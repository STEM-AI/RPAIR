from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated 
from ...permissions import IsJudgeUser 
from rest_framework import status
from ...serializers.team_serializers.team_data_serializers import TeamSerializer
from ...models import Team ,Organization
from ...utils import event_utils
from rest_framework.generics import ListAPIView , CreateAPIView


class UserCreateTeamView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TeamSerializer

    def get_serializer_context(self):
        """
        Override this method to add the event to the serializer context.
        """
        context = super().get_serializer_context()
        # Fetch the event using your utility function
        event = event_utils.get_object(event_name=self.request.data.get('event_name'))
        if event is None:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        context['event'] = event
        return context

    def perform_create(self, serializer):
        # Save the team with the user ID and event
        try:
            serializer.save(user_id=self.request.user.id)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class UserTeamProfileView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TeamSerializer

    def get_queryset(self):
        user = self.request.user
        return (
            Team.objects
            .filter(user=user)
            .prefetch_related(
            'sponsors', 
            'social_media',
            'previous_competition',
            'coach',
            'members'
            )
            .select_related('organization' , 'competition_event')
            )

class UserTeamEditTeamProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self, request, team_name):
        user = request.user
        team = Team.objects.filter(user=user, name=team_name).first()
        serializer = TeamSerializer(team, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class UserChangeTeamOrganizationView(APIView):
    permission_classes = [IsJudgeUser]
    def patch(self, request, team_name):
        user = request.user
        team = Team.objects.filter(name=team_name).first()
        if not team:
            return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)
        organization_name = request.data.get("organization_name")
        if not organization_name:
            return Response({"error": "Organization name is required"}, status=status.HTTP_400_BAD_REQUEST)
        organization = Organization.objects.filter(name=organization_name).first()
        if not organization:
            return Response({"error": "Organization not found"}, status=status.HTTP_404_NOT_FOUND)
        team.organization = organization
        team.save()
        return Response({"message": "Team organization changed successfully"}, status=status.HTTP_200_OK)
        
class UserDeleteTeamView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, team_name):
        user = request.user
        team = Team.objects.filter(user=user, name=team_name).first()
        if team:
            team.delete()
            return Response({"message": "Team deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Team not found"}, status=status.HTTP_404_NOT_FOUND)