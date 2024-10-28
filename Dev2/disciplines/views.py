from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Disciplines
import json

@csrf_exempt
def discipline_list(request):
    if request.method == 'GET':
        disciplines = list(Disciplines.objects.values(
            'id', 'name', 'workload', 'syllabus',
            'prerequisites__id', 'professors__id'
        ))
        return JsonResponse(disciplines, safe=False, status=200)

@csrf_exempt
def discipline_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        # Criar a disciplina com os campos simples
        discipline = Disciplines.objects.create(
            name=data.get('name'),
            workload=data.get('workload'),
            syllabus=data.get('syllabus', "")
        )

        # Adicionar relacionamentos Many-to-Many (se fornecidos)
        if 'prerequisites' in data:
            discipline.prerequisites.set(data['prerequisites'])

        if 'professors' in data:
            discipline.professors.set(data['professors'])

        return JsonResponse(
            {"id": str(discipline.id), "message": "Disciplina criada com sucesso!"},
            status=201
        )

@csrf_exempt
def discipline_read(request, pk):
    if request.method == 'GET':
        discipline = get_object_or_404(Disciplines, pk=pk)
        return JsonResponse({
            "id": str(discipline.id),
            "name": discipline.name,
            "workload": discipline.workload,
            "syllabus": discipline.syllabus,
            "prerequisites": list(discipline.prerequisites.values_list('id', flat=True)),
            "professors": list(discipline.professors.values_list('id', flat=True))
        }, status=200)

@csrf_exempt
def discipline_update(request, pk):
    if request.method == 'PUT':
        discipline = get_object_or_404(Disciplines, pk=pk)
        data = json.loads(request.body)

        # Atualizar campos simples
        discipline.name = data.get('name', discipline.name)
        discipline.workload = data.get('workload', discipline.workload)
        discipline.syllabus = data.get('syllabus', discipline.syllabus)
        discipline.save()

        # Atualizar relacionamentos Many-to-Many
        if 'prerequisites' in data:
            discipline.prerequisites.set(data['prerequisites'])

        if 'professors' in data:
            discipline.professors.set(data['professors'])

        return JsonResponse({"message": "Disciplina atualizada com sucesso!"}, status=200)

@csrf_exempt
def discipline_delete(request, pk):
    if request.method == 'DELETE':
        discipline = get_object_or_404(Disciplines, pk=pk)
        discipline.delete()
        return JsonResponse({"message": "Disciplina excluída com sucesso!"}, status=204)