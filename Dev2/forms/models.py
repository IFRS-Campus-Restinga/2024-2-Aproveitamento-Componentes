import uuid

from django.db import models
from django.utils import timezone


class RequestStatus(models.TextChoices):
    CREATED_REQUEST = "CR", "Solicitação Criada"
    IN_ANALYSIS_BY_CRE = "CRE", "Em análise do Ensino"
    IN_ANALYSIS_BY_PROFESSOR = "PROF", "Em análise do Professor"
    IN_ANALYSIS_BY_COORDINATOR = "COORD", "Em análise do Coordenador"
    REJECTED_BY_CRE = "RJ_CRE", "Rejeitado pelo Ensino"
    REJECTED_BY_COORDINATOR = "RJ_COORD", "Rejeitado pelo Coordenador"
    APPROVING = "APPROVING", "Em retorno"
    SCHEDULED_TEST = "SCHEDULED_TEST", "Prova Agendada"
    GRANTED = "GRANTED", "Deferido"
    REJECTED = "REJECTED", "Indeferido"
    COMPLETED = "COMPLETED", "Concluído"


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


class RequisitionForm(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    step = models.ForeignKey(Step, on_delete=models.CASCADE)
    create_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=RequestStatus.choices, default=RequestStatus.CREATED_REQUEST)
    servant_feedback = models.TextField(blank=True, null=True)
    servant_analysis_date = models.DateTimeField(null=True, blank=True)
    professor_feedback = models.TextField(blank=True, null=True)
    professor_analysis_date = models.DateTimeField(null=True, blank=True)
    coordinator_feedback = models.TextField(blank=True, null=True)
    coordinator_analysis_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Requisition {self.id} - {self.status}"
