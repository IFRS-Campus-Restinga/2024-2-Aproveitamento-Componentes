from rest_framework import generics

from .models import RecognitionOfPriorLearning, KnowledgeCertification, Step
from .serializers import (
    RecognitionOfPriorLearningSerializer, KnowledgeCertificationSerializer, StepSerializer
)
# View para listar e criar Steps
class StepListCreateView(generics.ListCreateAPIView):
    queryset = Step.objects.all()
    serializer_class = StepSerializer


# View para listar e criar RecognitionOfPriorLearning
class RecognitionOfPriorLearningListCreateView(generics.ListCreateAPIView):
    queryset = RecognitionOfPriorLearning.objects.all()
    serializer_class = RecognitionOfPriorLearningSerializer


# View para detalhes de uma RecognitionOfPriorLearning específica
class RecognitionOfPriorLearningDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RecognitionOfPriorLearning.objects.all()
    serializer_class = RecognitionOfPriorLearningSerializer
    lookup_field = 'id'


# View para listar e criar KnowledgeCertification
class KnowledgeCertificationListCreateView(generics.ListCreateAPIView):
    queryset = KnowledgeCertification.objects.all()
    serializer_class = KnowledgeCertificationSerializer


# View para detalhes de uma KnowledgeCertification específica
class KnowledgeCertificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = KnowledgeCertification.objects.all()
    serializer_class = KnowledgeCertificationSerializer
    lookup_field = 'id'
