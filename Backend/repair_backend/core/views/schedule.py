from rest_framework.generics import ListAPIView ,RetrieveDestroyAPIView
from core.serializers import ScheduleSerializer,ScheduleDetailSerializer
from rapair_db.permissions import IsJudgeUser
from rest_framework.permissions import AllowAny
from core.models import Schedule
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend


class ScheduleListView(ListAPIView):
    """
    API view to retrieve a list of schedules.
    """
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsJudgeUser]
    pagination_class = None
    filter_backends = [OrderingFilter]
    ordering_fields = ['id']
    ordering = ['id']

    @extend_schema(
        responses={
            200: OpenApiResponse(
                response=ScheduleSerializer(many=True),
                description='List of schedules',
            ),
        },
        parameters=[
            OpenApiParameter(
                name='event_name',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description='Name of the event',
                required=True
            ),
            OpenApiParameter(
                name='stage',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Stage of the event',
                required=False
            )
        ]
    )
    def get(self, request, *args, **kwargs):
        """
        Get the list of schedules.
        """
        event_name = self.kwargs.get('event_name')
        stage = request.query_params.get('stage')
        if event_name and stage:
            self.queryset = self.queryset.filter(event__name=event_name , stage=stage)
        return super().get(request, *args, **kwargs)
    


class ScheduleDetailView(RetrieveDestroyAPIView):
    """
    API view to retrieve or delete a schedule.
    """
    queryset = Schedule.objects.all()
    serializer_class = ScheduleDetailSerializer
    permission_classes = [IsJudgeUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['event__name', 'stage', 'event__event_game__team1__id']


    def perform_destroy(self, instance):
        """
        Perform the destroy operation for a schedule.
        """
        # Check if the schedule exists
        if not Schedule.objects.filter(id=instance.id).exists():
            raise ValueError("Schedule does not exist.")
        super().perform_destroy(instance)

