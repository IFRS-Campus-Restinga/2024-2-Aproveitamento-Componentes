from django.contrib import admin
from django.urls import path

from consultas import views

urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns = [
    path('api/users/', views.list_users, name='list_users'),
    path('api/users/students/', views.list_students, name='list_students'),
    path('api/users/servants/', views.list_servants, name='list_servants')
]
