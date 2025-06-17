from django.urls import path
from .views import QuestionListAPIView,QuestionDetailAPIView,UploadQuestionsCSV,NumberOfQuestionsUpdateView

urlpatterns = [
    path('questions/<int:competition_event_id>/', QuestionListAPIView.as_view(), name='question-list'),
    path('questions/<int:id>/', QuestionDetailAPIView.as_view(), name='question-detail'),
    path('upload-questions/', UploadQuestionsCSV.as_view(), name='upload-questions'),
    path('number-of-questions/<int:id>/', NumberOfQuestionsUpdateView.as_view(), name='number-of-questions-update'),
]