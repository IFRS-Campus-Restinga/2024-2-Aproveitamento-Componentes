from django.http import HttpResponse, Http404
from django.http import JsonResponse
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from django.urls import reverse
from django.test import Client  # Simula uma requisição interna para chamar o endpoint
from django.core.mail import send_mail

from django.urls import reverse
from django.test import Client  # Simula uma requisição interna para chamar o endpoint
from django.core.mail import send_mail

from .models import Notice, FAILED_STATUS
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
        serializer.save()

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
        servant_id = self.request.query_params.get('servant_id', None)
        if servant_id:
            try:
                steps = Step.objects.filter(current=True, responsible_id=servant_id).exclude(status__in=FAILED_STATUS)

                if not steps.exists():
                    return queryset.none()

                recognition_ids = steps.values_list('recognition_form_id', flat=True)
                queryset = queryset.filter(id__in=recognition_ids)

            except Step.DoesNotExist:
                return queryset.none()

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Salva o objeto no banco
            serializer.save()

            # Envia o e-mail diretamente
            # send_mail(
            #     "Assunto",
            #     "Email que estou mandando",
            #     "teste@teste.com.br",
            #     ["2019010480@restinga.ifrs.edu.br"]
            # )

            print("Email enviado com sucesso!")

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        servant_id = self.request.query_params.get('servant_id', None)
        if servant_id:
            try:
                steps = Step.objects.filter(current=True, responsible_id=servant_id).exclude(status__in=FAILED_STATUS)

                if not steps.exists():
                    return queryset.none()

                certification_ids = steps.values_list('certification_form_id', flat=True)
                queryset = queryset.filter(id__in=certification_ids)

            except Step.DoesNotExist:
                return queryset.none()

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Salva o objeto no banco
            serializer.save()

            # Envia o e-mail diretamente
            send_mail(
                "Assunto",
                "Email que estou mandando",
                "teste@teste.com.br",
                ["2019010480@restinga.ifrs.edu.br"]
            )

            print("Email enviado com sucesso!")

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

    def delete(self, request, attachment_id):
        
        try:
            Attachment.objects.filter(id=attachment_id).delete()
        except Attachment.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)

        response = Response(status=status.HTTP_200_OK)
        return response
