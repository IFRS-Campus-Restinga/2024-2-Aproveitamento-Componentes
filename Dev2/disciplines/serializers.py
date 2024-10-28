from rest_framework import serializers
from .models import *
from users.serializers.UsersSerializer import ServantSerializer

class DisciplinesSerializer(serializers.ModelSerializer):
    professors = ServantSerializer(many=True)  # Para mostrar detalhes dos professores

    class Meta:
        model = Disciplines
        fields = ['id', 'name', 'workload', 'professors']
