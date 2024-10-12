from django.db import models
from pedido.models.base import BaseModel
from django.core.validators import MinLengthValidator, FileExtensionValidator

class Anexo(BaseModel):
    class TipoAnexo(models.TextChoices):
        PDF = 'PDF'
        DOC = 'Documento'
        IMG = 'Imagem'
        OUTRO = 'Outro'

    nome = models.CharField(max_length=100, validators=[MinLengthValidator(1)], verbose_name="Nome do anexo", help_text="Digite o nome do anexo:")
    tipo = models.CharField(max_length=20, choices=TipoAnexo.choices, verbose_name="Tipo do anexo", help_text="Selecione o tipo do anexo:")
    arquivo = models.FileField(upload_to='uploads/arquivos/', validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'jpg', 'png'])], verbose_name="Arquivo do anexo", help_text="Insira o arquivo do anexo:")

    def __str__(self):
        return f'{self.nome} - {self.arquivo}'

    class Meta:
        abstract = False