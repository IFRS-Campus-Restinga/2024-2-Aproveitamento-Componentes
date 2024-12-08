import uuid
from django.db import models
from django.utils import timezone
from notices.models import Notice

# Enum para status da requisição
class RequestStatus(models.TextChoices):
    IN_ANALYSIS_BY_CRE = "CRE", "Em análise do Ensino"
    REJECTED_BY_CRE = "RJ_CRE", "Rejeitado pelo Ensino"
    IN_ANALYSIS_BY_COORDINATOR = "COORD", "Em análise do Coordenador"
    REJECTED_BY_COORDINATOR = "RJ_COORD", "Rejeitado pelo Coordenador"
    IN_ANALYSIS_BY_PROFESSOR = "PROF", "Em análise do Professor"
    REJECTED_BY_PROFESSOR = "RJ_PROF", "Rejeitado pelo Professor"
    GRANTED = "GRANTED", "Deferido"
    REJECTED = "REJECTED", "Indeferido"
    CANCELED = "CANCELED", "Cancelado"

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
    status = models.CharField(max_length=20, choices=RequestStatus.choices, default=RequestStatus.IN_ANALYSIS_BY_CRE)
    servant_feedback = models.TextField(blank=True, null=True)
    servant_analysis_date = models.DateTimeField(null=True, blank=True)
    professor_feedback = models.TextField(blank=True, null=True)
    professor_analysis_date = models.DateTimeField(null=True, blank=True)
    coordinator_feedback = models.TextField(blank=True, null=True)
    coordinator_analysis_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True

    def __str__(self):
        return f"RequisitionForm {self.id} - {self.status}"


# Model de RecognitionOfPriorLearning, derivado de RequisitionForm
class RecognitionOfPriorLearning(RequisitionForm):
    notice = models.ForeignKey(Notice, on_delete=models.CASCADE, related_name="recognition_notices")
    course_workload = models.IntegerField()
    test_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
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
    notice_id = models.UUIDField()
    student_id = models.UUIDField()
    responsible_id = models.UUIDField()
    description = models.TextField()
    initial_step_date = models.DateTimeField(default=timezone.now)
    final_step_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Step {self.id} - {self.description}"
