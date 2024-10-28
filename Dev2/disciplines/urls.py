from django.urls import path
from . import views

urlpatterns = [
    path('api/disciplines/', views.discipline_list, name='discipline_list'),  # GET - Listar todas
    path('api/disciplines/create/', views.discipline_create, name='discipline_create'),  # POST - Criar
    path('api/disciplines/<uuid:pk>/', views.discipline_read, name='discipline_read'),  # GET - Ler uma específica
    path('api/disciplines/<uuid:pk>/update/', views.discipline_update, name='discipline_update'),  # PUT - Atualizar
    path('api/disciplines/<uuid:pk>/delete/', views.discipline_delete, name='discipline_delete'),  # DELETE - Excluir
]