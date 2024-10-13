from django.shortcuts import render

from .models.users import Servant
from .models.users import Student


def list_users(request):
    students = Student.objects.all()
    servants = Servant.objects.all()
    users = list(students) + list(servants)
    return render(request, 'list_users.html', {'users': users})


def list_students(request):
    students = Student.objects.all()
    return render(request, 'list_students.html', {'students': students})


def list_servants(request):
    servants = Servant.objects.all()
    return render(request, 'list_servants.html', {'servants': servants})
