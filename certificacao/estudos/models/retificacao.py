from django.db import models
from estudos.models.base import BaseModel
from django.core.validators import MinLengthValidator
from estudos.models.edital import Edital

class Retificacao(BaseModel):
    data = models.DateField(null=False, blank=False, verbose_name="Data da Retificação", help_text="Digite a data da retificação:")
    descricao = models.TextField(max_length=500, validators=[MinLengthValidator(1)], null=False, blank=False, verbose_name="Descrição", help_text="Digite a descrição da retificação:")
    edital = models.ForeignKey(Edital, on_delete=models.CASCADE, null=False, blank=False, related_name='retificacoes')

    def __str__(self):
        return f'Retificação de {self.edital.titulo} - {self.data}'

    class Meta:
        abstract = False