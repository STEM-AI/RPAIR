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

@extend_schema(
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'event_name': {'type': 'string'},
                'organization_info': {
                    'type': 'object',
                    'properties': {
                        'name': {'type': 'string'},
                        'address': {'type': 'string'},
                        'type': {'type': 'string'},
                        'email': {'type': 'string'},
                        'contacts': {
                            'type': 'array',
                            'items': {
                                'type': 'object',
                                'properties': {
                                    'phone_number': {'type': 'string'}
                                }
                            }
                        }
                    }
                },
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
                'organization_info': {
                    'type': 'object',
                    'properties': {
                        'name': {'type': 'string'},
                        'address': {'type': 'string'},
                        'type': {'type': 'string'},
                        'email': {'type': 'string'},
                        'contacts': {
                            'type': 'array',
                            'items': {
                                'type': 'object',
                                'properties': {
                                    'phone_number': {'type': 'string'}
                                }
                            }
                        }
                    }
                },
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
class UserCreateTeamView(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    def post(self, request):
        print("request.data",request.data)
        print("request.content_type",request.content_type)
        event = event_utils.get_object(event_name=request.data.get('event_name'))
        if not event:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

        # Parse JSON strings from form data
        data = request.data.copy()
        if 'multipart/form-data' in request.content_type:
            print("multipart/form-data")
            json_fields = ['organization_info', 'members', 'sponsors', 'previous_competition', 'coach', 'social_media']
            
            for field in json_fields:
                if field in data:
                    print(f"Processing field: {field}")
                    try:
                        field_value = data.get(field)
                        
                        # If the field is already a list, process each item
                        if isinstance(field_value, list):
                            processed_items = []
                            for item in field_value:
                                if isinstance(item, str):
                                    processed_items.append(json.loads(item))
                                else:
                                    processed_items.append(item)
                            data[field] = processed_items
                        # If it's a string, parse it as JSON
                        elif isinstance(field_value, str):
                            parsed_value = json.loads(field_value)
                            data[field] = parsed_value
                            
                        print(f"Processed {field}: {data[field]}")
                    except json.JSONDecodeError as e:
                        print(f"JSON decode error for {field}: {e}")
                        return Response(
                            {"error": f"Invalid JSON format for {field}"}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
        
        # Fix organization_info structure
        if 'organization_info' in data and isinstance(data['organization_info'], list):
            data['organization_info'] = data['organization_info'][0] if data['organization_info'] else {}
            
        # Add phone_number to organization_info if missing
        if 'organization_info' in data and 'contacts' in data['organization_info']:
            contacts = data['organization_info']['contacts']
            if contacts and 'phone_number' not in data['organization_info']:
                data['organization_info']['phone_number'] = contacts[0].get('phone_number', '')
                
        # Ensure members is properly formatted
        if 'members' in data and isinstance(data['members'], list) and len(data['members']) > 0:
            # Make sure we're not wrapping a list in a list unnecessarily
            if len(data['members']) == 1 and isinstance(data['members'][0], list):
                data['members'] = data['members'][0]
                
        print("Final processed data:", data)
        serializer = TeamSerializer(data=data, context={'event': event})
        if serializer.is_valid():
            print(serializer.errors)
            team = serializer.save(user_id=request.user.id)
            return Response({
                "message": "Team created successfully",
                "team": serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            print("serializer.errors",serializer.errors)
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
    def get_serializer_class(self):
        if self.request.query_params.get('minimal','false') == 'true':
            return TeamMinimalSerializer
        return TeamSerializer

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