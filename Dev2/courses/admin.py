from django.contrib import admin

from .models import Course
from .models.planoPedagogicoCurso import PlanoPedagogicoCurso

# Register your models here.
admin.site.register(Course)
admin.site.register(PlanoPedagogicoCurso)
