from .user import AbstractUser

class Servant(AbstractUser):

    class Meta:
        abstract = False