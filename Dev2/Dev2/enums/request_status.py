from django.utils.translation import gettext_lazy as _
from django.db import models


class RequestStatus(models.TextChoices):
    STUDENT = _('Student'), _('Estudante')


