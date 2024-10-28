from django.contrib import admin

from .models import Servant, Student, Course, Discipline

# Register your models here.
admin.site.register(Servant)
admin.site.register(Student)
admin.site.register(Course)
admin.site.register(Discipline)