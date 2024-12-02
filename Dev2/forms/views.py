from datetime import datetime

from django.http import HttpResponse, Http404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from .models import RecognitionOfPriorLearning, KnowledgeCertification, RequestStatus, Attachment, Step
from .serializers import (
    RecognitionOfPriorLearningSerializer, KnowledgeCertificationSerializer, StepSerializer
)
from django.http import HttpResponse, Http404
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from django.utils import timezone
from .models import Notice

def check_notice_open(request):
    # Obtém a data atual do servidor
    current_date = timezone.now()

    # Filtra o edital baseado nas datas de início e fim de submissão
    notice = Notice.objects.filter(
        documentation_submission_start__lte=current_date,  # A data de início é menor ou igual à data atual
        documentation_submission_end__gte=current_date   # A data de fim é maior ou igual à data atual
    ).first()

    # Se encontrar um edital aberto, retorna True, caso contrário, False
    return JsonResponse({'isNoticeOpen': bool(notice)})

class StepCreateView(generics.CreateAPIView):
    queryset = Step.objects.all()
    serializer_class = StepSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class RecognitionOfPriorLearningDetailView(generics.RetrieveUpdateAPIView):
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
class KnowledgeCertificationDetailView(generics.RetrieveUpdateAPIView):
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
        attachment_file = request.FILES.get('test_attachment')
        if attachment_file:
            existing_test_attachment = instance.attachments.filter(is_test_attachment=True).first()
            if existing_test_attachment:
                existing_test_attachment.file_name = attachment_file.name
                existing_test_attachment.file_data = attachment_file.read()
                existing_test_attachment.content_type = attachment_file.content_type
                existing_test_attachment.save()
            else:
                Attachment.objects.create(
                    file_name=attachment_file.name,
                    file_data=attachment_file.read(),
                    content_type=attachment_file.content_type,
                    certification_form=instance,
                    is_test_attachment=True
                )

        instance.save()

        serializer = self.get_serializer(instance)
        return Response(status.HTTP_201_CREATED)


class AttachmentDownloadView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, attachment_id):
        try:
            attachment = Attachment.objects.get(id=attachment_id)
        except Attachment.DoesNotExist:
            raise Http404("Attachment not found")

        response = HttpResponse(attachment.file_data, content_type=attachment.content_type)

        response['Content-Disposition'] = f'inline; filename="{attachment.file_name}"'
        return response
