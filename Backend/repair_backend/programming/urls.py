from django.urls import path
from .views import QuestionListAPIView,QuestionDetailAPIView,UploadQuestionsCSV

urlpatterns = [
    path('', QuestionListAPIView.as_view(), name='question-list'),
    path('<int:id>/', QuestionDetailAPIView.as_view(), name='question-detail'),
    path('upload-questions/', UploadQuestionsCSV.as_view(), name='upload-questions'),
]