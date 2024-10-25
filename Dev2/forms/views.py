from rest_framework import generics
from .models import RequisitionForm, Step
from .serializers import RequisitionFormSerializer, StepSerializer

# View para listar e criar Steps
class StepListCreateView(generics.ListCreateAPIView):
    queryset = Step.objects.all()
    serializer_class = StepSerializer


# View para listar e criar RequisitionForms
class RequisitionFormListCreateView(generics.ListCreateAPIView):
    queryset = RequisitionForm.objects.all()
    serializer_class = RequisitionFormSerializer


# View para detalhes de uma RequisitionForm específica
class RequisitionFormDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RequisitionForm.objects.all()
    serializer_class = RequisitionFormSerializer
    lookup_field = 'id'
