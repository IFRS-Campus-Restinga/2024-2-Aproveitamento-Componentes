from rest_framework import serializers

from . import CourseSerializer
from ..models.planoPedagogicoCurso import PlanoPedagogicoCurso
from ...disciplines.serializers import DisciplineSerializer


class PlanoSerializer(serializers.ModelSerializer):
    curso = CourseSerializer(read_only=True, allow_null=True, required=True)
    disciplina = DisciplineSerializer(read_only=True, allow_null=True,required=True)

    class Meta:
        model = PlanoPedagogicoCurso
        fields = ['all']
