from django.urls import path

from .views import (
    RecognitionOfPriorLearningListCreateView, RecognitionOfPriorLearningDetailView,
    KnowledgeCertificationListCreateView, KnowledgeCertificationDetailView, AttachmentDownloadView, StepCreateView
)

urlpatterns = [
    path('steps/', StepCreateView.as_view(), name='step-create'),
    path('recognition-forms/', RecognitionOfPriorLearningListCreateView.as_view(),
         name='recognition-forms-list-create'),
    path('recognition-forms/<uuid:id>/', RecognitionOfPriorLearningDetailView.as_view(),
         name='recognition-form-detail'),
    path('knowledge-certifications/', KnowledgeCertificationListCreateView.as_view(),
         name='knowledge-certifications-list-create'),
    path('knowledge-certifications/<uuid:id>/', KnowledgeCertificationDetailView.as_view(),
         name='knowledge-certification-detail'),
    path('attachments/<uuid:attachment_id>/', AttachmentDownloadView.as_view(), name='download_attachment'),
]
