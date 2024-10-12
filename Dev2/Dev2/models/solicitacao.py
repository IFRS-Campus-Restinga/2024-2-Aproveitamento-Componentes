from django.core.validators import MinLengthValidator
from django.db import models


class Solicitacao(models.Model):
    class Status(models.TextChoices):
        SOLICITADO = 'Solicitação realizada',
        CRE_ANALISE = 'Em análise do CRE',
        COO_ANALISE = 'Em análise da Coordenação',
        PRO_ANALISE = 'Em análise do Professor',
        CRE_INDEFERIDO = 'Indeferido pelo CRE',
        COO_INDEFERIDO = 'Indeferido pela Coordenação',
        PROVA = 'Prova agendada',
        RETORNO = 'Em homologação',
        INDEFERIDO = 'Indeferido',
        DEFERIDO = 'Deferido',
        FINALIZADO = 'Finalizado',

    aluno = models.ForeignKey('Aluno', on_delete=models.CASCADE, verbose_name="Aluno", help_text="Selecione o aluno:")
    tipo = models.CharField(max_length=20,
                            choices=[('APROVEITAMENTO', 'Aproveitamento'), ('CERTIFICACAO', 'Certificação')],
                            verbose_name="Tipo de Solicitação", help_text="Selecione o tipo de solicitação:")
    disciplina = models.CharField(max_length=100, validators=[MinLengthValidator(1)], blank=False, null=False,
                                  verbose_name="Disciplina", help_text="Digite a disciplina:")
    experiencia = models.TextField(max_length=500, validators=[MinLengthValidator(1)], blank=True, null=True,
                                   verbose_name="Experiência",
                                   help_text="Descreva sua experiência relacionada, se aplicável:")
    documentos = models.ManyToManyField('Anexo', blank=True, verbose_name="Documentos Anexos",
                                        help_text="Anexe os documentos:")
    status = models.CharField(max_length=50, choices=Status.choices, verbose_name="Status",
                              help_text="Selecione o status da solicitação:")

    def __str__(self):
        return f'Solicitação {self.tipo} - Disciplina: {self.disciplina} - Aluno: {self.aluno} - Status: {self.status}'

    class Meta:
        abstract = False
