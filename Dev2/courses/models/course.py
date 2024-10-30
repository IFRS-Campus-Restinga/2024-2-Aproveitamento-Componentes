import uuid
from django.db import models
from users.models.servant import Servant

from disciplines.models import Disciplines


class Course(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    professors = models.ManyToManyField(Servant, related_name="course_professors")
    disciplines = models.ManyToManyField(Disciplines, related_name='courses')

    def __str__(self):
        return self.name