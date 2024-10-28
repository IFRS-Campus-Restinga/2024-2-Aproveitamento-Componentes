from django.shortcuts import render, get_object_or_404, redirect
from .models import Disciplines
from .forms import DisciplineForm


def discipline_list(request):
    # Listar todas as disciplinas
    disciplines = Disciplines.objects.all()
    context = {
        "disciplines": disciplines
    }
    return render(request, "disciplines/discipline_list.html", context)


def discipline_create(request):
    # Criar uma nova disciplina
    if request.method == 'POST':
        form = DisciplineForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('discipline_list')  # Redirecionar para a lista de disciplinas
    else:
        form = DisciplineForm()

    context = {
        "form": form,
    }
    return render(request, "disciplines/discipline_form.html", context)


def discipline_read(request, pk):
    # Ler uma disciplina específica
    discipline = get_object_or_404(Disciplines, pk=pk)
    context = {
        "discipline": discipline,
    }
    return render(request, "disciplines/discipline_detail.html", context)


def discipline_update(request, pk):
    # Atualizar uma disciplina existente
    discipline = get_object_or_404(Disciplines, pk=pk)
    if request.method == 'POST':
        form = DisciplineForm(request.POST, instance=discipline)
        if form.is_valid():
            form.save()
            return redirect('discipline_list')  # Redirecionar para a lista de disciplinas
    else:
        form = DisciplineForm(instance=discipline)

    context = {
        "form": form,
        "discipline_id": pk,
    }
    return render(request, "disciplines/discipline_form.html", context)


def discipline_delete(request, pk):
    # Excluir uma disciplina
    discipline = get_object_or_404(Disciplines, pk=pk)
    if request.method == 'POST':
        discipline.delete()
        return redirect('discipline_list')  # Redirecionar para a lista de disciplinas
    context = {
        "discipline": discipline,
    }
    return render(request, "disciplines/discipline_delete.html", context)