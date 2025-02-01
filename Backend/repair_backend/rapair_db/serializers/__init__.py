from .tokens_serializers import MyTokenObtainPairSerializer
from .organization_serializers import OrganizationSerializer , OrganizationContactSerializer , OrganizationTeamSerializer
from .team_serializers  import TeamCoachSerializer , TeamMemberSerializer ,TeamPreviousCompetitionSerializer ,TeamSerializer , TeamSocialMediaSerializer , TeamSponsorSerializer 
from .user_serializers.user_data_serializers import UserSerializer , UserEditProfileSerializer
from .competitions_serializers import CompetitionsSerializer 
from .event_serializers import TeamCompetitionProfileSerializer , EventSerializer , EventGameSerializer , EventListSerializer
from .news_serializers import NewsSerializer