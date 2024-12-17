from rest_framework import serializers

from ..models.planoPedagogicoCurso import PlanoPedagogicoCurso
# from ...disciplines.serializers import DisciplineSerializer
# from . import CourseSerializer


class PlanoSerializer(serializers.ModelSerializer):
    # curso = CourseSerializer(read_only=True, allow_null=True, required=True)
    # disciplina = DisciplineSerializer(read_only=True, allow_null=True,required=True)

    class Meta:
        model = PlanoPedagogicoCurso
        fields = ['all']
