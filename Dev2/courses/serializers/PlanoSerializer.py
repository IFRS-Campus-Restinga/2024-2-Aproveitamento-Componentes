from rest_framework import serializers

from ..models.planoPedagogicoCurso import PlanoPedagogicoCurso
# from . import CourseSerializer
# from disciplines.serializers import DisciplineSerializer


class PlanoSerializer(serializers.ModelSerializer):
    # curso = CourseSerializer(read_only=True, allow_null=True)
    # disciplina = DisciplineSerializer(read_only=True, allow_null=True)

    class Meta:
        model = PlanoPedagogicoCurso
        fields = "__all__"
