from django.urls import path

from ..views.news_views import(
    NewsListCreateView
)

urlpatterns = [
    # News APIs
    path('news/', NewsListCreateView.as_view(), name='news-list-create'),
]