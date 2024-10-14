from django.db import models
from estudos.models.base import BaseModel
from django.core.validators import MinLengthValidator
from estudos.models.cronograma import Cronograma

class Edital(BaseModel):
    titulo = models.CharField(max_length=100, validators=[MinLengthValidator(1)], null=False, blank=False, verbose_name="Título do edital", help_text="Digite o título do edital:")
    numero = models.CharField(max_length=30, validators=[MinLengthValidator(1)], null=False, blank=False, unique=True, verbose_name="Número do edital", help_text="Digite o número do edital:")
    descricao = models.TextField(max_length=500, validators=[MinLengthValidator(1)], null=False, blank=False, verbose_name="Texto do edital", help_text="Digite o conteúdo do edital:")
    dataPubli = models.DateTimeField(null=False, blank=False, verbose_name="Data de Publicação", help_text="Digite a data de publicação do edital:")
    cronograma = models.OneToOneField(Cronograma, on_delete=models.CASCADE, null=False, blank=False)

    def __str__(self):
        return f'{self.titulo} - {self.numero} - {self.dataPubli}'

    class Meta:
        abstract = False