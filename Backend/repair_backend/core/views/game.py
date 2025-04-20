from rest_framework.generics import CreateAPIView
from core.serializers import GameScheduleSerializer
from rapair_db.permissions import IsJudgeUser
from rapair_db.models import EventGame
from rest_framework import serializers
from core.utils import create_schedule
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
                        "stage": "driver_go",
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
                "stage": ["driver_go","driver_iq","teamwork","auto","coop","coding","vex_123"],
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
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        created_instances = serializer.save()

        # If multiple games were created, serialize them all
        serialized_data = GameScheduleSerializer(created_instances, many=True).data

        headers = self.get_success_headers(serialized_data)
        return Response(serialized_data, status=status.HTTP_201_CREATED, headers=headers)

