from django.urls import path
from . import views

from django.urls import path

urlpatterns = [
    path('', views.discipline_list_create, name='discipline_list_create'),
    path('<uuid:pk>/', views.discipline_detail, name='discipline_detail'),
]