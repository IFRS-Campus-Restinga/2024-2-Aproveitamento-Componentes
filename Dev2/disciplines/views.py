from django.shortcuts import render, get_object_or_404, redirect
from rest_framework import generics
from .models import Disciplines
from .serializers import DisciplinesSerializer

class DisciplineList(generics.ListAPIView):
    queryset = Disciplines.objects.all()
    serializer_class = DisciplinesSerializer

class DisciplineCreate(generics.CreateAPIView):
    queryset = Disciplines.objects.all()
    serializer_class = DisciplinesSerializer

class DisciplineRead(generics.RetrieveAPIView):
    queryset = Disciplines.objects.all()
    serializer_class = DisciplinesSerializer

class DisciplineUpdate(generics.UpdateAPIView):
    queryset = Disciplines.objects.all()
    serializer_class = DisciplinesSerializer

class DisciplineDelete(generics.DestroyAPIView):
    queryset = Disciplines.objects.all()
    serializer_class = DisciplinesSerializer