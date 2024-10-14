from django.db import models
from estudos.models.base import BaseModel
from django.core.validators import MinLengthValidator

class Usuario(BaseModel):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100, validators=[MinLengthValidator(1)], verbose_name="Nome", help_text="Digite seu nome:")
    email = models.EmailField(max_length=100, validators=[MinLengthValidator(1)], unique=True, verbose_name="Email", help_text="Digite seu email:")

    def is_aluno(self):
        from estudos.models.aluno import Aluno
        return isinstance(self, Aluno)

    def is_servidor(self):
        from estudos.models.servidor import Servidor
        return isinstance(self, Servidor)

    class Meta:
        abstract = False