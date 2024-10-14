from django.db import models
from . import Usuario

class Estudante(Usuario):

    class Meta:
        abstract = False