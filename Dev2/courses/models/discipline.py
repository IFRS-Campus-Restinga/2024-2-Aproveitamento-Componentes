from django.db import models
from users.models.servant import Servant

class Discipline(models.Model):
    name = models.CharField(max_length=255)
    professors = models.ManyToManyField(Servant, related_name="disciplines")

    def __str__(self):
        return self.name