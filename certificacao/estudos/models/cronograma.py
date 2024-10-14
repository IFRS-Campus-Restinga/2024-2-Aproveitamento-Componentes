from django.db import models
from estudos.models.base import BaseModel
from django.core.validators import MinLengthValidator

class Cronograma(BaseModel):
    class Etapa(models.TextChoices):
        SOLICITACAO = 'Período de Solicitações',
        ANALISE = 'Período de Análises',
        HOMOLOGACAO = 'Homologação',
        NOVA = 'Nova etapa'

    nome = models.CharField(max_length=100,  validators=[MinLengthValidator(1)], blank=True, verbose_name="Nome do cronograma", help_text="Digite o nome do cronograma:")
    etapa = models.CharField(max_length=100, choices=Etapa.choices)

    def __str__(self):
        return f'{self.nome} - {self.etapa}'

    class Meta:
        abstract = False