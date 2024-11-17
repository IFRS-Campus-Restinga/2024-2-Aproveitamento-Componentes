from django.urls import path
from . import views

from django.urls import path

from .views import (ListDisciplinesAPIView,RetrieveDisciplineByIdAPIView)

urlpatterns = [
    path('', views.discipline_list_create, name='discipline_list_create'),
    path('<uuid:pk>/', views.discipline_detail, name='discipline_detail'),
    path('list', ListDisciplinesAPIView.as_view(), name='list_disciplines'),
    path('read/<uuid:discipline_id>/', RetrieveDisciplineByIdAPIView.as_view(), name='read_discipline_by_id'),
]