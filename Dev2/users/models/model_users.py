from django.db import models
from django.utils import timezone

from ..enum.user_type_enum import UserTypeEnum


class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True  # Define que essa classe não será criada como tabela no banco de dados

    def __str__(self):
        return self.name


class Servant(User):
    siape = models.CharField(max_length=20)
    user_type = models.CharField(
        max_length=50,
        choices=[(tag, tag.value) for tag in UserTypeEnum],  # Definindo enum como choices
    )

    def __str__(self):
        return f"{self.name} - {self.siape}"


class Student(User):
    registration = models.CharField(max_length=20)
    entry_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.name} - {self.registration}"
