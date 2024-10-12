from django.db import models

from Dev2.models.aluno import Aluno
from Dev2.models.disciplina import Disciplina
from Dev2.models.servidor import Servidor


class Prova(models.Model):
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE, related_name='provas',
                                   verbose_name="Disciplina", help_text="Selecione a disciplina correspondente:")
    data = models.DateField(verbose_name="Data de Aplicação", help_text="Informe a data de aplicação da prova:")
    professor = models.ForeignKey(Servidor, on_delete=models.SET_NULL, null=True, blank=True,
                                  limit_choices_to={'cargo': 'PROFESSOR'}, related_name='provas',
                                  verbose_name="Professor Responsável",
                                  help_text="Selecione o professor responsável pela prova:")
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='provas', verbose_name="Aluno",
                              help_text="Selecione o aluno que realizará a prova:")

    def __str__(self):
        return f'{self.disciplina.nome} - {self.data} - {self.aluno.nome}'

    class Meta:
        abstract = False
