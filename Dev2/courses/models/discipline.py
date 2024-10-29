from django.db import models

class Discipline(models.Model):
    name = models.CharField(max_length=255)
    professors = models.JSONField()

    def __str__(self):
        return self.name