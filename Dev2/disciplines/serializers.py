from rest_framework import serializers
from .models import Disciplines  # Certifique-se de que a importação do modelo esteja correta
from users.serializers.UsersSerializer import ServantSerializer

class DisciplinesSerializer(serializers.ModelSerializer):
    professors = ServantSerializer(many=True, required=False)  # Permitir que o campo seja opcional

    class Meta:
        model = Disciplines
        fields = ['id', 'name', 'workload', 'syllabus', 'prerequisites', 'professors']  # Inclua syllabus e prerequisites

    def create(self, validated_data):
        professors_data = validated_data.pop('professors', [])
        discipline = Disciplines.objects.create(**validated_data)
        discipline.professors.set(professors_data)  # Associar professores
        return discipline

    def update(self, instance, validated_data):
        professors_data = validated_data.pop('professors', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if professors_data is not None:
            instance.professors.set(professors_data)  # Atualizar professores
        return instance

