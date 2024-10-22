from . import AbstractUser

class Student(AbstractUser):

    class Meta:
        abstract = False