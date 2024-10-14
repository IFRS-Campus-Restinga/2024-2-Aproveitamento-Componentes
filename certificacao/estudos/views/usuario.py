from django.shortcuts import render, get_object_or_404, redirect
from estudos.forms.servidorForm import ServidorForm
from estudos.forms.alunoForm import AlunoForm
from estudos.models.usuario import Usuario

def usuario_list(request):
    usuarios = Usuario.objects.all()
    context = {
        "usuarios": usuarios
    }
    return render(request, "estudos/usuario_list.html", context)

def delete(request, usuario_id):
    usuario = get_object_or_404(Usuario, pk=usuario_id)
    try:
        usuario.delete()
        return redirect('estudos:usuario_list')
    except Usuario.DoesNotExist:
        print(f"Usuário não encontrado.")
        return redirect('estudos:usuario_list')
    except:
        context = {
            "message": "Error while deleting object.",
        }
        return render(request, "estudos/usuario_list.html", context)

def update(request, usuario_id):
    usuario = get_object_or_404(Usuario, pk=usuario_id)
    try:
        if request.method == "POST":
            form = ServidorForm(request.POST, instance=usuario)
            if form.is_valid():
                form.save()
            return redirect('estudos:usuario_list')
        else:
            form = ServidorForm(instance=usuario)
            context = {
                "form": form,
                "usuario_id": usuario_id,
            }
            return render(request, "estudos/usuario_edit.html", context)
    except:
        return redirect(request, 'estudos:usuario_list')

def read(request, usuario_id):
    usuario = get_object_or_404(Usuario, pk=usuario_id)
    context = {
        "usuario": usuario,
    }
    return render(request, "estudos/usuario_read.html", context)

def create(request):
    if request.method == 'POST':
        form = ServidorForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('estudos:usuario_list')
    else:
        form = ServidorForm
    context = {
        "form": form,
    }
    return render(request, "estudos/usuario_create.html", context)