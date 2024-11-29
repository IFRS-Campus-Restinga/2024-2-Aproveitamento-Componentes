import uuid

from django.db import models
from django.utils import timezone

from notices.models import Notice
from users.models.servant import Servant


# Enum para status da requisição
class RequestStatus(models.TextChoices):
    IN_ANALYSIS_BY_CRE = "CRE", "Em análise do Ensino"
    CANCELED = "CANCELED", "Cancelado pelo Aluno"
    CANCELED_BY_CRE = "C_CRE", "Cancelado pelo Ensino"
    ANALYZED_BY_CRE = "A_CRE", "Analisado pelo Ensino"
    IN_ANALYSIS_BY_COORDINATOR = "COORD", "Em análise do Coordenador"
    CANCELED_BY_COORDINATOR = "C_COORD", "Cancelado pelo Coordenador"
    ANALYZED_BY_COORDINATOR = "A_COORD", "Analisado pelo Coordenador"
    IN_ANALYSIS_BY_PROFESSOR = "PROF", "Em análise do Professor"
    REJECTED_BY_PROFESSOR = "RJ_PROF", "Rejeitado pelo Professor"
    ANALYZED_BY_PROFESSOR = "A_PROF", "Analisado pelo Professor"
    IN_APPROVAL_BY_COORDINATOR = "IN_AP_COORD", "Em homologação do Coordenador"
    RETURNED_BY_COORDINATOR = "R_COORD", "Retornado pelo Coordenador"
    REJECTED_BY_COORDINATOR = "RJ_COORD", "Rejeitado pelo Coordenador"
    APPROVED_BY_COORDINATOR = "AP_COORD", "Aprovado pelo Coordenador"
    IN_APPROVAL_BY_CRE = "IN_AP_CRE", "Em homologação do Ensino"
    RETURNED_BY_CRE = "R_CRE", "Retornado pelo Ensino"
    REJECTED_BY_CRE = "RJ_CRE", "Rejeitado pelo Ensino"
    APPROVED_BY_CRE = "AP_CRE", "Aprovado pelo Ensino"

    def get_request_status_by_string(value):
        for status in RequestStatus.values:
            if status == value:
                return getattr(RequestStatus, status)


STUDENT_STATUS = [
    RequestStatus.IN_ANALYSIS_BY_CRE,
    RequestStatus.CANCELED,
]

CRE_STATUS = [
    RequestStatus.CANCELED_BY_CRE,
    RequestStatus.ANALYZED_BY_CRE,
    RequestStatus.RETURNED_BY_CRE,
    RequestStatus.REJECTED_BY_CRE,
    RequestStatus.APPROVED_BY_CRE,
    RequestStatus.IN_ANALYSIS_BY_COORDINATOR
]

COORD_STATUS = [
    RequestStatus.CANCELED_BY_COORDINATOR,
    RequestStatus.ANALYZED_BY_COORDINATOR,
    RequestStatus.RETURNED_BY_COORDINATOR,
    RequestStatus.REJECTED_BY_COORDINATOR,
    RequestStatus.APPROVED_BY_COORDINATOR,
    RequestStatus.IN_ANALYSIS_BY_PROFESSOR,
    RequestStatus.IN_APPROVAL_BY_CRE
]

PROF_STATUS = [
    RequestStatus.REJECTED_BY_PROFESSOR,
    RequestStatus.ANALYZED_BY_PROFESSOR,
    RequestStatus.IN_APPROVAL_BY_COORDINATOR
]

SUCCESS_STATUS = [
    RequestStatus.ANALYZED_BY_CRE,
    RequestStatus.ANALYZED_BY_COORDINATOR,
    RequestStatus.ANALYZED_BY_PROFESSOR,
    RequestStatus.APPROVED_BY_COORDINATOR,
    RequestStatus.APPROVED_BY_CRE
]

FAILED_STATUS = [
    RequestStatus.CANCELED,
    RequestStatus.CANCELED_BY_CRE,
    RequestStatus.CANCELED_BY_COORDINATOR,
    RequestStatus.REJECTED_BY_PROFESSOR,
    RequestStatus.REJECTED_BY_COORDINATOR,
    RequestStatus.REJECTED_BY_CRE
]

PENDING_STATUS = [
    RequestStatus.IN_ANALYSIS_BY_CRE,
    RequestStatus.IN_ANALYSIS_BY_COORDINATOR,
    RequestStatus.IN_ANALYSIS_BY_PROFESSOR,
    RequestStatus.IN_APPROVAL_BY_COORDINATOR,
    RequestStatus.IN_APPROVAL_BY_CRE,
    RequestStatus.RETURNED_BY_COORDINATOR,
    RequestStatus.RETURNED_BY_CRE
]

ANALYSIS_STATUS = [
    RequestStatus.IN_ANALYSIS_BY_CRE,
    RequestStatus.IN_ANALYSIS_BY_COORDINATOR,
    RequestStatus.IN_ANALYSIS_BY_PROFESSOR,
    RequestStatus.IN_APPROVAL_BY_COORDINATOR,
    RequestStatus.IN_APPROVAL_BY_CRE
]

RETURNED_STATUS = [
    RequestStatus.RETURNED_BY_COORDINATOR,
    RequestStatus.RETURNED_BY_CRE
]


class Attachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file_name = models.CharField(max_length=255)
    file_data = models.BinaryField()
    content_type = models.CharField(max_length=50)
    recognition_form = models.ForeignKey(
        'RecognitionOfPriorLearning',
        related_name='attachments',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    certification_form = models.ForeignKey(
        'KnowledgeCertification',
        related_name='attachments',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    def __str__(self):
        return self.file.name


# Model abstrato RequisitionForm
class RequisitionForm(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE)
    discipline = models.ForeignKey('disciplines.Disciplines', on_delete=models.CASCADE)
    create_date = models.DateTimeField(default=timezone.now)

    class Meta:
        abstract = True

    def __str__(self):
        return f"RequisitionForm {self.id} - {self.status}"


# Model de RecognitionOfPriorLearning, derivado de RequisitionForm
class RecognitionOfPriorLearning(RequisitionForm):
    notice = models.ForeignKey(Notice, on_delete=models.CASCADE, related_name="recognition_notices")
    course_workload = models.IntegerField()
    course_studied_workload = models.IntegerField()

    def __str__(self):
        return f"RecognitionOfPriorLearning {self.id}"


# Model de KnowledgeCertification, derivado de RequisitionForm
class KnowledgeCertification(RequisitionForm):
    notice = models.ForeignKey(Notice, on_delete=models.CASCADE, related_name="certification_notices")
    previous_knowledge = models.TextField()
    scheduling_date = models.DateTimeField(null=True, blank=True)
    test_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"KnowledgeCertification {self.id}"


# Model de Step
class Step(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status = models.CharField(max_length=20, choices=RequestStatus.choices)
    responsible = models.ForeignKey(Servant, on_delete=models.SET_NULL, null=True)
    feedback = models.TextField(blank=True, null=True)
    initial_step_date = models.DateTimeField(default=timezone.now)
    final_step_date = models.DateTimeField(null=True, blank=True)
    current = models.BooleanField(default=True)
    recognition_form = models.ForeignKey(
        'RecognitionOfPriorLearning',
        related_name='steps',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    certification_form = models.ForeignKey(
        'KnowledgeCertification',
        related_name='steps',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Step {self.id} - {self.status}"
