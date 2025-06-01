from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated 
from ...permissions import IsJudgeUser 
from rest_framework import status
from ...serializers.team_serializers.team_data_serializers import TeamSerializer,TeamMinimalSerializer
from ...models import Team ,Organization
from core.utils import event_utils
from rest_framework.generics import ListAPIView , RetrieveAPIView
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import json
from django_filters.rest_framework import DjangoFilterBackend
import logging
logger = logging.getLogger(__name__)

class UserCreateTeamView(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    @extend_schema(
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'event_name': {'type': 'string'},
                'organization_id': {'type': 'string'},
                'name': {'type': 'string'},
                'robot_name': {'type': 'string'},
                'type': {'type': 'string'},
                'team_leader_name': {'type': 'string'},
                'team_leader_email': {'type': 'string'},
                'team_leader_phone_number': {'type': 'string'},
                'team_number': {'type': 'string'},
                'members': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {'type': 'string'},
                            'email': {'type': 'string'},
                            'phone_number': {'type': 'string'}
                        }
                    }
                },
                'sponsors': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {'type': 'string'},
                            'email': {'type': 'string'}
                        }
                    }
                },
                'previous_competition': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {'type': 'string'},
                            'year': {'type': 'string'}
                        }
                    }
                },
                'coach': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {'type': 'string'},
                            'email': {'type': 'string'},
                            'phone_number': {'type': 'string'},
                            'position': {'type': 'string'}
                        }
                    }
                },
                'social_media': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'platform': {'type': 'string'},
                            'url': {'type': 'string'}
                        }
                    }
                }
            }
        },
        'multipart/form-data': {
            'type': 'object',
            'properties': {
                'event_name': {'type': 'string'},
                'organization_id': {'type': 'string'},
                'name': {'type': 'string'},
                'robot_name': {'type': 'string'},
                'type': {'type': 'string'},
                'team_leader_name': {'type': 'string'},
                'team_leader_email': {'type': 'string'},
                'team_leader_phone_number': {'type': 'string'},
                'team_number': {'type': 'string'},
                'image': {'type': 'string', 'format': 'binary'},
                'members': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {'type': 'string'},
                            'email': {'type': 'string'},
                            'phone_number': {'type': 'string'}
                        }
                    }
                },
                'sponsors': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {'type': 'string'},
                            'email': {'type': 'string'}
                        }

                    }
                },
                'previous_competition': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {'type': 'string'},
                            'year': {'type': 'string'}
                        }
                    }
                },
                'coach': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {'type': 'string'},
                            'email': {'type': 'string'},
                            'phone_number': {'type': 'string'},
                            'position': {'type': 'string'}
                        }
                    }
                },
                'social_media': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'platform': {'type': 'string'},
                            'url': {'type': 'string'}
                        }
                    }
                }
            }
        }
    },
    responses={201: TeamSerializer}
)
    def post(self, request):
        print("request.data",request.data)
        print("request.content_type",request.content_type)
        event = event_utils.get_object(event_name=request.data.get('event_name'))
        if not event:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

         # Create a completely new dictionary for data processing
        processed_data = {}
        
        # Handle standard form fields
        standard_fields = ['event_name', 'name', 'robot_name', 'type', 'team_leader_name', 
                          'team_leader_email', 'team_leader_phone_number', 'team_number', 'image','organization_id']
        
        for field in standard_fields:
            if field in request.data:
                # Get the first item if it's a list (normal behavior for form data)
                value = request.data.get(field)
                if isinstance(value, list) and len(value) == 1:
                    processed_data[field] = value[0]
                else:
                    processed_data[field] = value
        
        # Handle JSON fields that need special processing
        json_fields = ['members', 'sponsors', 'previous_competition', 'coach', 'social_media']
        
        for field in json_fields:
            if field in request.data:
                try:
                    # Get the raw value from the QueryDict
                    raw_value = request.data.get(field)
                    
                    # If we have a list with one item (common with form data), use that item
                    if isinstance(raw_value, list) and len(raw_value) == 1:
                        raw_value = raw_value[0]
                    
                    # If it's a string, try to parse it as JSON
                    if isinstance(raw_value, str):
                        parsed_value = json.loads(raw_value)
                        
                        # For list fields, ensure we have a list
                        if field in ['members', 'sponsors', 'previous_competition', 'coach', 'social_media']:
                            if not isinstance(parsed_value, list):
                                parsed_value = [parsed_value]
                        
                        processed_data[field] = parsed_value
                    else:
                        # Already a parsed object
                        processed_data[field] = raw_value
                        
                    logger.info(f"Processed {field}: {processed_data[field]}")
                except json.JSONDecodeError as e:
                    logger.error(f"JSON decode error for {field}: {str(e)}")
                    return Response(
                        {"error": f"Invalid JSON format for {field}: {str(e)}"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
        # Validate all required fields are present
        required_fields = ['members', 'organization_id']
        missing_fields = [field for field in required_fields if field not in processed_data]
        if missing_fields:
            return Response({field: ["This field is required."] for field in missing_fields}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Create team
        serializer = TeamSerializer(data=processed_data, context={'event': event, 'request': request})
        if serializer.is_valid():
            team = serializer.save(user_id=request.user.id)
            return Response({
                "message": "Team created successfully",
                "team": serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    parameters=[
        OpenApiParameter(
            name='minimal',
            description='If true, return minimal team data',
            required=False,
            type=bool
        )
    ]
)
class UserTeamListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TeamMinimalSerializer
    filter_backends = [DjangoFilterBackend]
    queryset = Team.objects.all()
    filterset_fields = ['competition_event__name','competition_event__competition__name']

    def get_queryset(self):
        user = self.request.user
        return Team.objects.filter(user=user)

class UserTeamRetrieveView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TeamSerializer
    lookup_field = 'name'
    lookup_url_kwarg = 'team_name'

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