from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated 
from ...permissions import IsJudgeUser
from rest_framework import status
from ...serializers.team_serializers.team_data_serializers import TeamSerializer
from ...models import Team ,Organization , Competition
# //sponsers , scoial meadia , previous comp , team coach 
class UserCreateTeamView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request):
        competition = request.data.get('competition', '')
        if not competition:
            return Response({"error": "Competition is required"}, status=status.HTTP_400_BAD_REQUEST)
        competition = Competition.objects.filter(name = competition).first()
        if not competition:
            return Response({"error": "Competition not found"}, status=status.HTTP_404_NOT_FOUND)
        return competition

    def post(self, request):
        competition = self.get_object(request)
        serializer = TeamSerializer(data = request.data , context = {'competition':competition})
        if serializer.is_valid():
            serializer.save(user_id=request.user.id)
            return Response(f"message': 'Team created successfully Team :{serializer.data} ", status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class UserTeamProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        team = (
        Team.objects.filter(user=user)
        .prefetch_related(
            'sponsors', 
            'social_media',
            'previous_competition',
            'coach',
            'members'
        )
        .select_related('organization', 'competition')
        )
        serializer = TeamSerializer(team , many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

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
        


