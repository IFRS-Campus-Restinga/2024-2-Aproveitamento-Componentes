from django.db import models
from django.utils import timezone
import uuid
from django.core.validators import MinLengthValidator, MinValueValidator

from disciplines.models import Disciplines
from courses.models import Course

class PedagogicalPlanCourse(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, validators=[MinLengthValidator(10)])
    authorization = models.CharField(max_length=50, validators=[MinLengthValidator(10)])
    year = models.IntegerField(validators=[MinValueValidator(2020)])  # Exemplo: ano mínimo permitido
    start_duration = models.DateField(default=timezone.now)
    end_duration = models.DateField()
    total_workload = models.IntegerField(validators=[MinValueValidator(2000)])  # Carga horária mínima de 2000
    duration = models.IntegerField(validators=[MinValueValidator(6)])  # Duração mínima de 6 semestre
    turn = models.CharField(max_length=15, validators=[MinLengthValidator(5)])
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="pedagogical_plans")
    disciplines = models.ManyToManyField(Disciplines, related_name="pedagogical_plans")

    def __str__(self):
        return f"{self.name} ({self.year})"
