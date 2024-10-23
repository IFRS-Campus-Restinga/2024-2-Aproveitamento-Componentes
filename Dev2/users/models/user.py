from django.db import models
from django.contrib.auth.models import User
from polymorphic.models import PolymorphicModel
from ..enum.user_type_enum import UserTypeEnum

class AbstractUser(PolymorphicModel):

    user = models.OneToOneField(User, related_name="perfil", on_delete=models.CASCADE)
    nome = models.CharField(verbose_name="Nome", max_length=255)
    email = models.EmailField(max_length = 254)
    dataCadastro = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    @property
    def tipo(self):
        """
        Retorna o tipo de usuário como um valor de UsuarioTipoEnum.
        """
        return UserTypeEnum(self.__class__.__name__)

    @property
    def tipoString(self):
        """
        Retorna a string do tipo de usuário.
        """
        return self.tipo.getTipoString()

    class Meta:
        abstract = False

