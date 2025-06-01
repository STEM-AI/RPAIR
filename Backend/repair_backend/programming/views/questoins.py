from rest_framework.generics import ListAPIView,RetrieveAPIView
from programming.models import Question
from programming.serializers import QuestionMinimalSerializer,QuestionSerializer
import random
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework.permissions import AllowAny,IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from core.utils.questions import  add_questoins_from_csv
import csv
from rest_framework.parsers import MultiPartParser
import logging
logger = logging.getLogger(__name__)

@extend_schema(
    parameters=[
        OpenApiParameter(name='number_of_questions', description='Number of questions to return', required=False, type=int)
    ]
)
class QuestionListAPIView(ListAPIView):
    serializer_class = QuestionMinimalSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Get the number of questions from query parameter, default to 20 if not provided
        num_questions = int(self.request.query_params.get('number_of_questions', 20))
        
        # Calculate questions per category
        session_count = int(num_questions * 0.25)  # 25% for session
        compiler_count = int(num_questions * 0.25)  # 25% for compiler
        problem_solving_count = num_questions - session_count - compiler_count  # Remaining 50% for problem solving
        
        # Get questions from each category
        session_questions = Question.objects.filter(
            category='session'
        ).order_by('?')[:session_count]
        
        compiler_questions = Question.objects.filter(
            category='compiler'
        ).order_by('?')[:compiler_count]
        
        problem_solving_questions = Question.objects.filter(
            category='problem_solving'
        ).order_by('?')[:problem_solving_count]
        
        # Combine all questions
        combined_questions = list(session_questions) + list(compiler_questions) + list(problem_solving_questions)
        
        # Shuffle the combined list to randomize the order
        random.shuffle(combined_questions)
        
        return combined_questions
    
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
    permission_classes = [IsAdminUser]  

    def post(self, request, *args, **kwargs):
        try:
            file = request.FILES['file']
            logger.info(f"Uploading questions from file: {file}")
        except KeyError:
            return Response({"detail": "No file was submitted."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate file extension
        if not file.name.endswith('.csv'):
            return Response({"detail": "Only CSV files are allowed."}, status=status.HTTP_400_BAD_REQUEST)
        
        decoded_file = file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)
        try:
            add_questoins_from_csv(reader)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Questions added successfully."}, status=status.HTTP_201_CREATED)
            
    