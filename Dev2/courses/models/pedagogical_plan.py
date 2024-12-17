import uuid
from django.utils import timezone
from django.db import models
from django.core.validators import MinLengthValidator
from disciplines.models import Disciplines
from .course import Course

#Modelo de plano pedagogico
class PedagogicalPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    authorization = models.CharField(validators=[MinLengthValidator(10)] ,max_length=50)
    year = models.IntegerField()
    start_duration = models.DateField(default=timezone.now)
    end_duration = models.DateField()
    total_workload = models.CharField(validators=[MinLengthValidator(2000)], max_length=50)
    duration = models.IntegerField()
    turn = models.CharField(validators=[MinLengthValidator(5)] ,max_length=15)
    courses = models.ManyToManyField(Course, related_name="course")
    disciplines = models.ManyToManyField(Disciplines, related_name='discipline')

    def __str__(self):
        return self.name