from datetime import datetime

from django.http import HttpResponse, Http404
from django.http import JsonResponse
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from ..emails.utils import send_custom_email
from django.utils.timezone import now

from .models import Notice
from .models import RecognitionOfPriorLearning, KnowledgeCertification, RequestStatus, Attachment, Step
from .serializers import (
    RecognitionOfPriorLearningSerializer, KnowledgeCertificationSerializer, StepSerializer
)


def check_notice_open(request):
    # Obtém a data atual do servidor
    current_date = timezone.now()

    # Filtra o edital baseado nas datas de início e fim de submissão
    notice = Notice.objects.filter(
        documentation_submission_start__lte=current_date,  # A data de início é menor ou igual à data atual
        documentation_submission_end__gte=current_date  # A data de fim é maior ou igual à data atual
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
        # serializer.save()
        
        step = serializer.save()
        # Configura o conteúdo do e-mail
        subject = "Novo Step Criado"
        context = {
            'subject': subject,
            'message': f"Step '{step.name}' foi criado com sucesso!",
            'date': now(),
        }
        recipient_list = ["destinatario@example.com"]  # Substitua pelos e-mails reais

        # Dispara o e-mail
        send_custom_email(subject, 'emails/example_email.html', context, recipient_list)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RecognitionOfPriorLearningListCreateView(generics.ListCreateAPIView):
    queryset = RecognitionOfPriorLearning.objects.all()
    serializer_class = RecognitionOfPriorLearningSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context

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


class RecognitionOfPriorLearningDetailView(generics.RetrieveUpdateAPIView):
    queryset = RecognitionOfPriorLearning.objects.all()
    serializer_class = RecognitionOfPriorLearningSerializer
    lookup_field = 'id'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data
        serializer = self.get_serializer(instance, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class KnowledgeCertificationListCreateView(generics.ListCreateAPIView):
    queryset = KnowledgeCertification.objects.all()
    serializer_class = KnowledgeCertificationSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context

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


class KnowledgeCertificationDetailView(generics.RetrieveUpdateAPIView):
    queryset = KnowledgeCertification.objects.all()
    serializer_class = KnowledgeCertificationSerializer
    lookup_field = 'id'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data
        serializer = self.get_serializer(instance, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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
