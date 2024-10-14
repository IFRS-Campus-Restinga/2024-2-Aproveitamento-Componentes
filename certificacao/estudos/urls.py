from django.urls import path
from . import views

app_name = 'estudos'

urlpatterns = [
    path('usuario/', views.usuario_list, name='usuario_list'),
    path('usuario/create/', views.create, name='usuario_create'),
    path('usuario/<int:usuario_id>/', views.read, name='usuario_read'),
    path('usuario/delete/<int:usuario_id>/', views.delete, name='usuario_delete'),
    path('usuario/update/<int:usuario_id>/', views.update, name='usuario_update'),
]