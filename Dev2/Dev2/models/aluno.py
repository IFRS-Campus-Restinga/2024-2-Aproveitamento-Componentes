from django.db import models
from django.core.validators import MinLengthValidator


class Aluno(models.Model):
    nome = models.CharField(max_length=100, validators=[MinLengthValidator(1)], null=False, blank=False, verbose_name="Nome", help_text="Digite seu nome:")
    email = models.EmailField(max_length=100, validators=[MinLengthValidator(1)], null=False, blank=False, unique=True, verbose_name="Email", help_text="Digite seu email:")
    matricula = models.IntegerField(unique=True, verbose_name="Matrícula", help_text="Digite sua matrícula:")

    def __str__(self):
        return f'{self.nome} - {self.email} - {self.matricula}'

    class Meta:
        abstract = False