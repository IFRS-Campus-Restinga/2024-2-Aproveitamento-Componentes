from rest_framework import serializers

from ..models import Course
from disciplines.serializers import DisciplinesSerializer

from users.serializers import ServantSerializer


class CourseSerializer(serializers.ModelSerializer):
    professors = ServantSerializer(many=True)
    disciplines = DisciplinesSerializer(many=True)

    class Meta:
        model = Course
        fields = ['id', 'name', 'professors', 'disciplines']
