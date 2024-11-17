from rest_framework import serializers

from ..models import Course
from disciplines.models import Disciplines

from users.models import Servant


class CourseSerializer(serializers.ModelSerializer):
    professors = serializers.PrimaryKeyRelatedField(queryset=Servant.objects.all(), many=True)
    disciplines = serializers.PrimaryKeyRelatedField(queryset=Disciplines.objects.all(), many=True)

    class Meta:
        model = Course
        fields = ['id', 'name', 'professors', 'disciplines']
