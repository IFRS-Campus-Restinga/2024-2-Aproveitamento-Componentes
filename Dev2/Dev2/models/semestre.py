from django.core.validators import MinLengthValidator
from django.db import models

from Dev2.models.curso import Curso
from Dev2.models.edital import Edital


class Semestre(models.Model):
    titulo = models.CharField(max_length=20, validators=[MinLengthValidator(1)], unique=True, null=False, blank=False,
                              verbose_name="Título", help_text="Digite o título do semestre:")
    dataInicio = models.DateField(null=False, blank=False, verbose_name="Data Inicio",
                                  help_text="Digite a data de início do semestre:")
    dataFim = models.DateField(null=False, blank=False, verbose_name="Data Fim",
                               help_text="Digite a data de fim do semestre:")
    edital = models.OneToOneField(Edital, on_delete=models.CASCADE, null=False, blank=False)
    cursos = models.ManyToManyField(Curso, related_name='semestres', verbose_name="Cursos Ativos",
                                    help_text="Selecione os cursos ativos neste semestre.")

    def __str__(self):
        return f'{self.titulo} - {self.dataInicio} - {self.dataFim}'

    class Meta:
        abstract = False
