from django.urls import path, include
from consultas import views

urlpatterns = [
    path('detalhes-usuario', views.DetalhesUsuario.as_view(), name='detalhes-usuario')
]