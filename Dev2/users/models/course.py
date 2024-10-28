from django.db import models

from Dev2.users.models.discipline import Discipline


class Course(models.Model):
    name = models.CharField(max_length=255)
    professors = models.JSONField()  # Armazenará a lista de GUIDs como JSON
    disciplines = models.ForeignKey(Discipline, on_delete=models.CASCADE, related_name='courses')

    def __str__(self):
        return self.name