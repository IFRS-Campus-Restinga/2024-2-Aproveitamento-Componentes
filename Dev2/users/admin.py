from django.contrib import admin
from .models import AbstractUser, Servant, Student

# Register your models here.
admin.site.register((
   AbstractUser,
   Student
))