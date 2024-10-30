from django.db import models
from users.models.servant import Servant
import uuid

# Model Discipline
class Disciplines(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    workload = models.IntegerField()
    professors = models.ManyToManyField(Servant, related_name="disciplines")

    def __str__(self):
        return self.name