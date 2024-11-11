from django.db import models
from django.core.validators import MinLengthValidator
import uuid

class Disciplines(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(
        max_length=100,
        validators=[MinLengthValidator(1)],
        verbose_name="Discipline Name",
        help_text="Enter the name of the discipline:"
    )
    workload = models.CharField(
        max_length=10,
        validators=[MinLengthValidator(1)],
        verbose_name="Workload",
        help_text="Enter the workload of the discipline:"
    )
    syllabus = models.TextField(
        max_length=500,
        blank=True,
        verbose_name="Syllabus",
        help_text="Enter the syllabus of the discipline:"
    )
    prerequisites = models.ManyToManyField(
        'self',
        symmetrical=False,
        blank=True,
        related_name='required_disciplines',
        verbose_name="Prerequisites",
        help_text="Select the disciplines that are prerequisites:"
    )
    professors = models.TextField(
        max_length=50,
        blank=True,
        verbose_name="Professors",
        help_text="Select the professors for this discipline:"
    )

    def __str__(self):
        professors_names = ", ".join([prof.name for prof in self.professors.all()])
        return f"{self.name} - {professors_names}"

    class Meta:
        verbose_name = "Discipline"
        verbose_name_plural = "Disciplines"
        ordering = ['name']
