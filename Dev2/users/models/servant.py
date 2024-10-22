from .abstract_user import AbstractUser

class Servant(AbstractUser):

    class Meta:
        abstract = False