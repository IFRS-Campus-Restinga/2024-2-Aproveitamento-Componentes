from django.core.validators import MinLengthValidator
from django.db import models

from Dev2.models.disciplina import Disciplina


class PPC(models.Model):
    tituloAno = models.CharField(max_length=10, validators=[MinLengthValidator(4)], verbose_name="Ano",
                                 help_text="Digite o ano de inicio de vigência:")
    dataInicio = models.DateField(null=False, blank=False, verbose_name="Data Inicio",
                                  help_text="Digite a data de início do PPC:")
    disciplinas = models.ManyToManyField(Disciplina, related_name='ppcs', blank=True)

    def __str__(self):
        return f'{self.tituloAno} - {self.dataInicio}'

    class Meta:
        abstract = False
