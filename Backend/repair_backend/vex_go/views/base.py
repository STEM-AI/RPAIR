from rest_framework.generics import CreateAPIView
from vex_go.serializers import GameScheduleSerializer
from rapair_db.permissions import IsJudgeUser
from rapair_db.models import EventGame
from rest_framework import serializers
from rapair_db.utils.event_utils import create_schedule
from rapair_db.models import CompetitionEvent,EventGame
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from rest_framework import status

@extend_schema(
    request=GameScheduleSerializer,
    responses={
        201: OpenApiResponse(
            response=GameScheduleSerializer(many=True),
            description='List of created game schedules',
            examples=[
                OpenApiExample(
                    'Example response',
                    value=[{
                        "id": 1,
                        "team1": 101,
                        "team1_name": "Team Alpha",
                        "team2": 102,
                        "team2_name": "Team Beta",
                        "stage": "driver_iq",
                        "event_name": "Regional Championship",
                        "time": "10:00:00",
                    }],
                    response_only=True
                )
            ]
        ),
        400: OpenApiResponse(
            description='Bad request',
            examples=[
                OpenApiExample(
                    'Error example',
                    value={"error": "Invalid time format. Please use HH:MM."}
                )
            ]
        )
    },
    parameters=[
        OpenApiParameter(
            name='event_name',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.PATH,
            description='Name of the event',
            required=True
        )
    ],
    examples=[
        OpenApiExample(
            'Example request',
            value={
                "stage": "driver_iq",
                "game_time": "10:00"
            },
            request_only=True
        )
    ]
)
class GamesScheduleCreateView(CreateAPIView):
    queryset = EventGame.objects.all()
    serializer_class = GameScheduleSerializer
    permission_classes = [IsJudgeUser]

    def perform_create(self, serializer):
        event_name = self.kwargs.get('event_name')
        if not event_name:
            raise serializers.ValidationError("Event name is required")
        
        # Get the validated data from the serializer
        validated_data = serializer.validated_data
        stage = validated_data.get('stage')
        time = validated_data.get('game_time')

        if not stage:
            raise serializers.ValidationError("Stage is required")
        if not time:
            raise serializers.ValidationError("Time is required")

        try:
            event = CompetitionEvent.objects.get(name=event_name)
            event_games = create_schedule(event=event, stage=stage, time=time)
            
            if isinstance(event_games, Response):  # Check if the response is already handled
                raise serializers.ValidationError(event_games.data)
                
            # Store the created games in the serializer instance
            serializer.instance = event_games
            
        except CompetitionEvent.DoesNotExist:
            raise serializers.ValidationError("Event does not exist")
        except Exception as e:
            raise serializers.ValidationError(f"An error occurred: {str(e)}")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # If multiple games were created, serialize them all
        if isinstance(serializer.instance, list):
            serialized_data = GameScheduleSerializer(serializer.instance, many=True).data
        else:
            serialized_data = serializer.data
            
        headers = self.get_success_headers(serialized_data)
        return Response(serialized_data, status=status.HTTP_201_CREATED, headers=headers)

