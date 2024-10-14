from django.db.models import Q
from django.shortcuts import render

from Dev2.users.models.users import Servant
from Dev2.users.models.users import Student


def list_users(request):
    user_type = request.GET.get('user_type')
    name = request.GET.get('name')
    is_active = request.GET.get('is_active')

    students_filter = Q()
    servants_filter = Q()

    if user_type == 'Aluno':
        servants_filter &= Q(pk__isnull=True)
    elif user_type:
        students_filter &= Q(pk__isnull=True)
        servants_filter &= Q(user_type=user_type)

    if name:
        students_filter &= Q(name__icontains=name)
        servants_filter &= Q(name__icontains=name)

    if is_active is not None:
        is_active_bool = is_active.lower() == 'true'
        students_filter &= Q(is_active=is_active_bool)
        servants_filter &= Q(is_active=is_active_bool)

    students = Student.objects.filter(students_filter)
    servants = Servant.objects.filter(servants_filter)

    users = list(students) + list(servants)

    return render(request, 'list_users.html', {'users': users})


def list_students(request):
    name = request.GET.get('name')
    is_active = request.GET.get('is_active')

    students_filter = Q()

    if name:
        students_filter &= Q(name__icontains=name)

    if is_active is not None:
        is_active_bool = is_active.lower() == 'true'
        students_filter &= Q(is_active=is_active_bool)

    students = Student.objects.filter(students_filter)

    return render(request, 'list_students.html', {'students': students})


def list_servants(request):
    user_type = request.GET.get('user_type')
    name = request.GET.get('name')
    is_active = request.GET.get('is_active')

    servants_filter = Q()

    if user_type:
        servants_filter &= Q(user_type=user_type)

    if name:
        servants_filter &= Q(name__icontains=name)

    if is_active is not None:
        is_active_bool = is_active.lower() == 'true'
        servants_filter &= Q(is_active=is_active_bool)

    servants = Servant.objects.filter(servants_filter)

    return render(request, 'list_servants.html', {'servants': servants})
