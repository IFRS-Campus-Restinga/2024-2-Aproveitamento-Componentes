from . import AbstractUser
from django.db import models

class Student(AbstractUser):

    matricula = models.CharField(max_length=255, blank=True)
    course = models.TextField(blank=True)
    class Meta:
        abstract = False