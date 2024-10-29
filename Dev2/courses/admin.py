from django.contrib import admin

from .models import Course, Discipline

# Register your models here.
admin.site.register(Course)
admin.site.register(Discipline)