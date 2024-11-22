from datetime import datetime

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import RecognitionOfPriorLearning, KnowledgeCertification, RequestStatus, Attachment
from .serializers import (
    RecognitionOfPriorLearningSerializer, KnowledgeCertificationSerializer
)
from django.http import HttpResponse, Http404

# View para listar e criar RecognitionOfPriorLearning
class RecognitionOfPriorLearningListCreateView(generics.ListCreateAPIView):
    queryset = RecognitionOfPriorLearning.objects.all()
    serializer_class = RecognitionOfPriorLearningSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset

    def create(self, request, *args, **kwargs):
        print("Método create chamado com dados:", request.data)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            print("Dados validados com sucesso.")
        else:
            print("Dados inválidos:", serializer.errors)
        return super().create(request, *args, **kwargs)

        # View para detalhes de uma RecognitionOfPriorLearning específica


class RecognitionOfPriorLearningDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RecognitionOfPriorLearning.objects.all()
    serializer_class = RecognitionOfPriorLearningSerializer
    lookup_field = 'id'

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data

        allowed_fields = ['status', 'course_workload', 'course_studied_workload', 'coordinator_feedback',
                          'professor_feedback']

        for field in allowed_fields:
            if field in data:
                if field == 'status' and data[field] not in dict(RequestStatus.choices):
                    return Response({"detail": "Status inválido"}, status=status.HTTP_400_BAD_REQUEST)

                setattr(instance, field, data[field])

        instance.save()

        serializer = self.get_serializer(instance)
        return Response(status.HTTP_201_CREATED)


# View para listar e criar KnowledgeCertification
class KnowledgeCertificationListCreateView(generics.ListCreateAPIView):
    queryset = KnowledgeCertification.objects.all()
    print(queryset)
    serializer_class = KnowledgeCertificationSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset

    def create(self, request, *args, **kwargs):
        print("Método create chamado com dados:", request.data)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            print("Dados validados com sucesso.")
        else:
            print("Dados inválidos:", serializer.errors)
        return super().create(request, *args, **kwargs)


# View para detalhes de uma KnowledgeCertification específica
class KnowledgeCertificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = KnowledgeCertification.objects.all()
    serializer_class = KnowledgeCertificationSerializer
    lookup_field = 'id'

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data

        allowed_fields = ['status', 'previous_knowledge', 'scheduling_date', 'coordinator_feedback',
                          'professor_feedback', 'test_score']

        for field in allowed_fields:
            if field in data:
                if field == 'status' and data[field] not in dict(RequestStatus.choices):
                    return Response({"detail": "Status inválido"}, status=status.HTTP_400_BAD_REQUEST)

                if field == 'scheduling_date':
                    try:
                        scheduling_date = datetime.strptime(data[field], "%Y-%m-%dT%H:%M")
                        setattr(instance, field,
                                scheduling_date)
                    except ValueError:
                        return Response({"detail": "Formato de data e hora inválido"},
                                        status=status.HTTP_400_BAD_REQUEST)
                else:
                    setattr(instance, field, data[field])

        instance.save()

        serializer = self.get_serializer(instance)
        return Response(status.HTTP_201_CREATED)

class AttachmentDownloadView(APIView):
    def get(self, request, attachment_id):
        try:
            attachment = Attachment.objects.get(id=attachment_id)
        except Attachment.DoesNotExist:
            raise Http404("Attachment not found")

        response = HttpResponse(attachment.file_data, content_type=attachment.content_type)
        response['Content-Disposition'] = f'attachment; filename="{attachment.file_name}"'
        return response