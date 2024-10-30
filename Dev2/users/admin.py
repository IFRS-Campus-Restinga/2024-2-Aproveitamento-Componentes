from django.contrib import admin

from .models import Servant, Student, AbstractUser

# Register your models here.
admin.site.register((
   Student,
   Servant,
   AbstractUser,
))