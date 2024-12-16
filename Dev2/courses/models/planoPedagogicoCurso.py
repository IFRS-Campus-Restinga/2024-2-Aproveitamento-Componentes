from django.utils import timezone

from django.db import models
from django.core.validators import MinLengthValidator, MinValueValidator

from . import Course
from disciplines.models import Disciplines


class PlanoPedagogicoCurso(models.Model):
    nome = models.CharField(
        max_length=100,
        validators=[MinLengthValidator(10)],
        help_text="Entre com o nome do Plano Pedagogico:"
    )
    autorizacao = models.CharField(
        max_length=50,
        validators=[MinLengthValidator(10)],
        help_text="Informe o texto de autorização: "
    )
    ano = models.IntegerField(
        validators=[MinValueValidator(2020)],
        help_text="Entre com o ano: "
    )
    inicio_vigencia = models.DateField(default=timezone.now)
    fim_vigencia = models.DateField()
    carga_horaria = models.IntegerField(
        validators=[MinValueValidator(2000)],
        help_text="Min 2000 "
    )
    duracao = models.IntegerField(
        validators=[MinValueValidator(6)],
        help_text="Min 6 "
    )
    turno = models.CharField(
        max_length=15,
        validators=[MinLengthValidator(5)],
        help_text="Entre com o turno: "
    )
    courso = models.ForeignKey(
        Course,
        related_name='planoPedagogico',
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        default=None
    )
    disciplina = models.ForeignKey(
        Disciplines,
        related_name='planoPedagogico',
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        default=None
    )

    def __str__(self):
        return self.nome