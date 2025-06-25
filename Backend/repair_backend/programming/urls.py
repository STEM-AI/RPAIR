from django.urls import path
from .views import QuestionListAPIView,QuestionDetailAPIView,UploadQuestionsCSV,NumberOfQuestionsAndTimeLimitUpdateView,AnswerQuestionView

urlpatterns = [
    path('questions/<int:competition_event_id>/', QuestionListAPIView.as_view(), name='question-list'),
    path('question/<int:id>/', QuestionDetailAPIView.as_view(), name='question-detail'),
    path('upload-questions/', UploadQuestionsCSV.as_view(), name='upload-questions'),
    path('number-of-questions-time-limit/<int:id>/', NumberOfQuestionsAndTimeLimitUpdateView.as_view(), name='number-of-questions-time-limit-update'),
    path('answer-question/', AnswerQuestionView.as_view(), name='answer-question'),
]