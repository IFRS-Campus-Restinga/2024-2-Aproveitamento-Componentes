from django.db import models
from estudos.models.usuario import Usuario

class Aluno(Usuario):
    matricula = models.IntegerField(unique=True, verbose_name="Matrícula", help_text="Digite sua matrícula:")

    def __str__(self):
        return f'{self.nome} - {self.matricula}'

    class Meta:
        abstract = False