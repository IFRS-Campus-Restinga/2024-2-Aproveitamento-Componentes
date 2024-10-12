from django.core.validators import MinLengthValidator
from django.db import models


class Curso(models.Model):
    class Grau(models.TextChoices):
        GRADUACAO = 'Graduação'
        TECNOLOGO = 'Tecnólogo'

    class Modalidade(models.TextChoices):
        PRESENCIAL = 'Presencial'
        EAD = 'EAD'
        HIBRIDO = 'Híbrido'

    nome = models.CharField(max_length=100, validators=[MinLengthValidator(1)], null=False, blank=False,
                            verbose_name="Nome", help_text="Digite o nome do curso:")
    sigla = models.CharField(max_length=5, validators=[MinLengthValidator(2)], verbose_name="Sigla",
                             help_text="Digite a sigla do curso:")
    codigo = models.CharField(max_length=20, validators=[MinLengthValidator(1)], unique=True, verbose_name="Código",
                              help_text="Digite o código do curso:")
    duracao = models.IntegerField(verbose_name="Duração", help_text="Digite quantos semestres tem o curso:")
    grau = models.CharField(max_length=20, choices=Grau.choices)
    modalidade = models.CharField(max_length=10, choices=Modalidade.choices)
    coordenador = models.ForeignKey('Servidor', on_delete=models.SET_NULL, null=True, blank=True)
    ativo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nome} - {self.sigla}"

    class Meta:
        abstract = False
