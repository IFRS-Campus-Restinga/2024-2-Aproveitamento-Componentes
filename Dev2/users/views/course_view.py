from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from ..models import Course, Discipline
from ..serializers.CourseSerializer import CourseSerializer


class ListCoursesAPIView(APIView):

    def get(self, request, *args, **kwargs):
        course_name = request.GET.get('course_name')
        discipline_name = request.GET.get('discipline_name')

        courses_filter = Q()

        # Filtro pelo nome do curso
        if course_name:
            courses_filter &= Q(name__icontains=course_name)

        # Filtro pelo nome da disciplina associada ao curso
        if discipline_name:
            courses_filter &= Q(disciplines__name__icontains=discipline_name)

        # Buscando cursos de acordo com os filtros aplicados
        courses = Course.objects.filter(courses_filter)

        # Serializando os resultados
        courses_serialized = CourseSerializer(courses, many=True)

        return Response({'courses': courses_serialized.data})
