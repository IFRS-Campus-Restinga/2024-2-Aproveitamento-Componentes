from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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


class CreateCourseAPIView(APIView):

    def post(self, request, *args, **kwargs):
        # Serializa os dados recebidos para validar e criar o novo curso
        serializer = CourseSerializer(data=request.data)

        # Verifica se os dados são válidos
        if serializer.is_valid():
            # Cria o curso sem disciplinas para adicioná-las posteriormente
            course = serializer.save()

            # Adiciona as disciplinas ao curso, caso sejam fornecidas
            disciplines_data = request.data.get('disciplines')
            if disciplines_data:
                # Buscando as disciplinas pelo ID
                disciplines = Discipline.objects.filter(id__in=[d['id'] for d in disciplines_data])
                course.disciplines.set(disciplines)

            # Serializa novamente para retornar os dados do curso criado
            course_serialized = CourseSerializer(course)

            # Retorna a resposta com status 201 (Created)
            return Response(course_serialized.data, status=status.HTTP_201_CREATED)

        # Caso os dados não sejam válidos, retorna os erros de validação
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)