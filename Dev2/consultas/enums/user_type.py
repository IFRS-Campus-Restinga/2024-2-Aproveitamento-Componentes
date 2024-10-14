from django.utils.translation import gettext_lazy as _
from django.db import models


class UserType(models.TextChoices):
    CREATE_REQUEST = 'CREATE_REQUEST', _('Criando Requisição')
