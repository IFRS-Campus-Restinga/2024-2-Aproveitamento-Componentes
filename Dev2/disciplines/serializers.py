from rest_framework import serializers
from .models import Disciplines

class DisciplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disciplines
        fields = ['id', 'name', 'workload', 'syllabus', 'prerequisites', 'professors']
