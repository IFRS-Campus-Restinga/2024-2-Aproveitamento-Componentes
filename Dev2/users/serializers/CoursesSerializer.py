from rest_framework import serializers

from .DisciplineSerializer import DisciplineSerializer
from ..models import Course

class CourseSerializer(serializers.ModelSerializer):
    disciplines = DisciplineSerializer(many=True, read_only=True)
    professors = serializers.ListField(
        child=serializers.UUIDField(format='hex_verbose')
    )

    class Meta:
        model = Course
        fields = ['id', 'name', 'professors', 'disciplines']