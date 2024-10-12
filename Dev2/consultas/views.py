from django.shortcuts import render

from .models.users import Student
from .models.users import Servant


def list_students(request):
    students = Student.objects.all()
    return render(request, 'list_students.html', {'students': students})

def list_servants(request):
    servants = Servant.objects.all()
    return render(request, 'list_servants.html', {'servants': servants})