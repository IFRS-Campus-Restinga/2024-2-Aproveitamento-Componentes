from django.contrib import admin

from notices.models import Notice
from .models import AbstractUser, Servant, Student

# Register your models here.
admin.site.register((
   AbstractUser,
   Student,
   Servant,
   Notice
))