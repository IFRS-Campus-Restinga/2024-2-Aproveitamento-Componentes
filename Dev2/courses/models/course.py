import uuid

from django.db import models

from disciplines.models import Disciplines
from users.models.servant import Servant


class Course(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    coordinator = models.OneToOneField(Servant, on_delete=models.SET_NULL, null=True)
    professors = models.ManyToManyField(Servant, related_name="course_professors")
    disciplines = models.ManyToManyField(Disciplines, related_name='courses')

    def __str__(self):
        return self.name
