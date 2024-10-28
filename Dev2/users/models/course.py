from django.db import models

from .discipline import Discipline


class Course(models.Model):
    name = models.CharField(max_length=255)
    professors = models.JSONField()  # Armazenará a lista de GUIDs como JSON
    disciplines = models.ManyToManyField(Discipline, related_name='courses')

    def __str__(self):
        return self.name