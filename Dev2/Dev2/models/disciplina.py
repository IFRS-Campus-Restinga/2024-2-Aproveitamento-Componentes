from django.core.validators import MinLengthValidator
from django.db import models


class Disciplina(models.Model):
    nome = models.CharField(max_length=100, validators=[MinLengthValidator(1)], verbose_name="Nome da Disciplina",
                            help_text="Digite o nome da disciplina:")
    cargaHoraria = models.CharField(max_length=10, validators=[MinLengthValidator(1)], verbose_name="Carga Horária",
                                    help_text="Digite a carga horária da disciplina:")
    prerequisitos = models.ManyToManyField('self', symmetrical=False, blank=True,
                                           related_name='disciplinas_requisitadas', verbose_name="Pré-Requisitos",
                                           help_text="Selecione as disciplinas que são pré-requisitos:")
    ementa = models.TextField(max_length=500, blank=True, verbose_name="Ementa",
                              help_text="Digite a ementa da disciplina:")
    professor = models.ForeignKey('Servidor', on_delete=models.SET_NULL, null=True, blank=True,
                                  verbose_name="Professor", help_text="Selecione o professor da disciplina:")

    def __str__(self):
        return f'{self.nome} - {self.professor.nome}'

    class Meta:
        abstract = False
