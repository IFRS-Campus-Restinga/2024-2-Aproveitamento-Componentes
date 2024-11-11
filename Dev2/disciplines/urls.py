from django.urls import path

from .views import (ListDisciplinesAPIView,RetrieveDisciplineByIdAPIView)

urlpatterns = [
    path('list', ListDisciplinesAPIView.as_view(), name='list_disciplines'),
    path('read/<uuid:discipline_id>/', RetrieveDisciplineByIdAPIView.as_view(), name='read_discipline_by_id'),
]