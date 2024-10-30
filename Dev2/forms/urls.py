from django.urls import path
from .views import (
    StepListCreateView, RecognitionOfPriorLearningListCreateView, RecognitionOfPriorLearningDetailView,
    KnowledgeCertificationListCreateView, KnowledgeCertificationDetailView
)

urlpatterns = [
    path('steps/', StepListCreateView.as_view(), name='steps-list-create'),
    path('recognition-forms/', RecognitionOfPriorLearningListCreateView.as_view(), name='recognition-forms-list-create'),
    path('recognition-forms/<uuid:id>/', RecognitionOfPriorLearningDetailView.as_view(), name='recognition-form-detail'),
    path('knowledge-certifications/', KnowledgeCertificationListCreateView.as_view(), name='knowledge-certifications-list-create'),
    path('knowledge-certifications/<uuid:id>/', KnowledgeCertificationDetailView.as_view(), name='knowledge-certification-detail'),
]
