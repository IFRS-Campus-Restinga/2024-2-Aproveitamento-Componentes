from django.db import models
from estudos.models.usuario import Usuario

class Servidor(Usuario):
    class Cargo(models.TextChoices):
        PROFESSOR = 'Professor',
        COORDENADOR = 'Coordenador',
        CRE = 'CRE',
        ADMINISTRADOR = 'Administrador',

    siape = models.IntegerField(unique=True, verbose_name="Siape", help_text="Digite seu siape:")
    cargo = models.CharField(max_length=30, choices=Cargo.choices, verbose_name="Cargo", help_text="Selecione o cargo do servidor:")

    def __str__(self):
        return f'{self.nome} - {self.siape}'

    class Meta:
        abstract = False