from django.urls import path
from .views import DisciplineList, DisciplineCreate, DisciplineRead, DisciplineUpdate, DisciplineDelete

urlpatterns = [
    path('disciplines/', DisciplineList.as_view(), name='discipline_list'),  # Listar disciplinas
    path('disciplines/create/', DisciplineCreate.as_view(), name='discipline_create'),  # Criar nova disciplina
    path('disciplines/<uuid:pk>/', DisciplineRead.as_view(), name='discipline_read'),  # Ler disciplina
    path('disciplines/<uuid:pk>/update/', DisciplineUpdate.as_view(), name='discipline_update'),  # Atualizar disciplina
    path('disciplines/<uuid:pk>/delete/', DisciplineDelete.as_view(), name='discipline_delete'),  # Excluir disciplina
]