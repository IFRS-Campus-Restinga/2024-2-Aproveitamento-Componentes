from django.urls import path
from .views import (
    discipline_list,
    discipline_create,
    discipline_read,
    discipline_update,
    discipline_delete,
)

urlpatterns = [
    path('', discipline_list, name='discipline_list'),  # Listar disciplinas
    path('create/', discipline_create, name='discipline_create'),  # Criar nova disciplina
    path('<uuid:pk>/', discipline_read, name='discipline_read'),  # Ler disciplina
    path('<uuid:pk>/update/', discipline_update, name='discipline_update'),  # Atualizar disciplina
    path('<uuid:pk>/delete/', discipline_delete, name='discipline_delete'),  # Excluir disciplina
]