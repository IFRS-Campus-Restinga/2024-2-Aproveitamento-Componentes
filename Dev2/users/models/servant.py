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

    def __str__(self):
        return self.name + " - " + self.servant_type
    
    @property
    def type(self):
        """
        Retorna o tipo de usuário como um valor de UsuarioTipoEnum.
        """
        return ServantTypeEnum(self.servant_type)

    @property
    def typeString(self):
        """
        Retorna a string do tipo de usuário.
        """
        return self.type.getTypeString()
    class Meta:
        abstract = False