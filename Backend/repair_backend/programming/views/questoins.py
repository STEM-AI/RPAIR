from rest_framework.generics import ListAPIView,RetrieveAPIView,UpdateAPIView
from programming.models import Question
from rapair_db.models import CompetitionEvent
from programming.serializers import QuestionMinimalSerializer,QuestionSerializer,ProgrammingCompetitionEventSerializer
import random
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from core.utils.questions import  add_questoins_from_csv
from rapair_db.permissions import IsJudgeUser
import csv
from rest_framework.parsers import MultiPartParser
from django_filters.rest_framework import DjangoFilterBackend
import logging
logger = logging.getLogger(__name__)


class NumberOfQuestionsUpdateView(UpdateAPIView):
    permission_classes = [IsJudgeUser]
    serializer_class = ProgrammingCompetitionEventSerializer
    queryset = CompetitionEvent.objects.all()
    lookup_field = 'id'
    lookup_url_kwarg = 'id'
@extend_schema(
    parameters=[
        OpenApiParameter(name='number_of_questions', description='Number of questions to return', required=False, type=int)
    ]
)
class QuestionListAPIView(ListAPIView):
    serializer_class = QuestionMinimalSerializer
    permission_classes = [AllowAny]
    queryset = Question.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category','type']

    def get_queryset(self):
        # Get the number of questions from query parameter, default to 20 if not provided
        competition_event_id = self.kwargs['competition_event_id']
        competition_event = CompetitionEvent.objects.get(id=competition_event_id)
        num_questions = int(self.request.query_params.get('number_of_questions', competition_event.number_of_questions))
        
        # Calculate questions per category
        session_count = int(num_questions * 0.25)  # 25% for session
        compiler_count = int(num_questions * 0.25)  # 25% for compiler
        problem_solving_count = num_questions - session_count - compiler_count  # Remaining 50% for problem solving
        
        # Get base queryset with filters applied
        base_queryset = Question.objects.all()
        
        # Apply any filters from request parameters
        if self.request.query_params:
            base_queryset = self.filter_queryset(base_queryset)
        
        # Get questions from each category with filters already applied
        session_questions = base_queryset.filter(category='session').order_by('?')[:session_count]
        compiler_questions = base_queryset.filter(category='compiler').order_by('?')[:compiler_count]
        problem_solving_questions = base_queryset.filter(category='problem_solving').order_by('?')[:problem_solving_count]
        
        # Combine all questions using union
        combined_questions = session_questions.union(
            compiler_questions,
            problem_solving_questions
        )
        
        return combined_questions

    def filter_queryset(self, queryset):
        """
        Override filter_queryset to prevent filtering after union
        """
        return queryset
    
class QuestionDetailAPIView(RetrieveAPIView):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()
    permission_classes = [AllowAny]
    lookup_field = 'id'
    lookup_url_kwarg = 'id'


@extend_schema(
    request={
        "multipart/form-data": {
            "type": "object",
            "properties": {
                "file": {"type": "string", "format": "binary"}
            }
        }
    },
    responses={200: "Questions added successfully."}
)
class UploadQuestionsCSV(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsJudgeUser]  

    def post(self, request, *args, **kwargs):
        try:
            file = request.FILES['file']
            logger.info(f"Uploading questions from file: {file}")
        except KeyError:
            return Response({"detail": "No file was submitted."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate file extension
        if not file.name.endswith('.csv'):
            return Response({"detail": "Only CSV files are allowed."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Try different encodings
        encodings = ['utf-8', 'latin-1', 'windows-1252', 'cp1252']
        decoded_file = None
        
        for encoding in encodings:
            try:
                file_content = file.read()
                decoded_file = file_content.decode(encoding).splitlines()
                break
            except UnicodeDecodeError:
                file.seek(0)  # Reset file pointer for next attempt
                continue
        
        if decoded_file is None:
            return Response(
                {"detail": "Could not decode the file. Please ensure it's a valid CSV file with proper encoding."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reader = csv.DictReader(decoded_file)
        try:
            add_questoins_from_csv(reader)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Questions added successfully."}, status=status.HTTP_201_CREATED)
            
    