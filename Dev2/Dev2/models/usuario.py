from django.db import models
from django.contrib.auth.models import User
from polymorphic.models import PolymorphicModel

class Usuario(PolymorphicModel):

    user = models.OneToOneField(User, related_name="perfil", on_delete=models.CASCADE,null=True, blank=True)
    nome = models.CharField(verbose_name="Nome", max_length=255)
    email = models.EmailField(max_length = 254)
    dataCadastro = models.DateTimeField(auto_now_add=True)
    avatar = models.CharField(verbose_name="avatar", max_length=255, null=True, blank=True)
    
    class Meta:
        abstract = False
        
