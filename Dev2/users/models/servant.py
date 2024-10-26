from django.db import models
from ..enum.servant_type_enum import ServantTypeEnum
from .user import AbstractUser

class Servant(AbstractUser):

    siape = models.CharField(max_length=255, blank=True)
    servant_type = models.CharField(
        max_length=50,
        choices=[(tag.name, tag.value) for tag in ServantTypeEnum],
        default=ServantTypeEnum.TEACHER.value,
        # Definindo enum como choices
    )
    
    @property
    def tipo(self):
        """
        Retorna o tipo de usuário como um valor de UsuarioTipoEnum.
        """
        return ServantTypeEnum(self.servant_type)

    @property
    def tipoString(self):
        """
        Retorna a string do tipo de usuário.
        """
        return self.tipo.getTipoString()
    class Meta:
        abstract = False