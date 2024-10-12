from django.db import models
from pedido.models.base import BaseModel
from django.core.validators import MinLengthValidator

class Servidor(BaseModel):
    class Cargo(models.TextChoices):
        PROFESSOR = 'Professor',
        COORDENADOR = 'Coordenador',
        CRE = 'CRE',
        ADMINISTRADOR = 'Administrador',

    nome = models.CharField(max_length=100, validators=[MinLengthValidator(1)], null=False, blank=False, verbose_name="Nome", help_text="Digite seu nome:")
    email = models.EmailField(max_length=100, validators=[MinLengthValidator(1)], null=False, blank=False, unique=True, verbose_name="Email", help_text="Digite seu email:")
    siape = models.IntegerField(unique=True, verbose_name="Siape", help_text="Digite seu siape:")
    cargo = models.CharField(max_length=30, choices=Cargo.choices, verbose_name="Cargo", help_text="Selecione o cargo do servidor:")

    def __str__(self):
        return f'{self.nome} - {self.email} - {self.cargo}'

    class Meta:
        abstract = False