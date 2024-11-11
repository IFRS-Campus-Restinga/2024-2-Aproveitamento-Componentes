from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from ..models import Course
from ..serializers.CourseSerializer import CourseSerializer
from disciplines.models import Disciplines
from users.models import Servant


class ListCoursesAPIView(APIView):

    def get(self, request, *args, **kwargs):
        course_name = request.GET.get('course_name')

        courses_filter = Q()

        # Filtro pelo nome do curso
        if course_name:
            courses_filter &= Q(name__icontains=course_name)

        # Buscando cursos de acordo com os filtros aplicados
        courses = Course.objects.filter(courses_filter)

        # Serializando os resultados
        courses_serialized = CourseSerializer(courses, many=True)

        return Response({'courses': courses_serialized.data})


class SearchCourseByNameAPIView(APIView):
    def get(self, request, *args, **kwargs):
        name = request.GET.get('name')

        # Verifica se o parâmetro de nome foi passado
        if not name:
            return Response({"error": "Name parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Busca cursos cujo nome contém o valor especificado, ignorando maiúsculas/minúsculas
        courses = Course.objects.filter(Q(name__icontains=name))

        # Serializa os cursos encontrados
        if courses.exists():
            serializer = CourseSerializer(courses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Retorna uma resposta vazia caso não encontre cursos
        return Response({"message": "No courses found with the specified name."}, status=status.HTTP_404_NOT_FOUND)




class CreateCourseAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CourseSerializer(data=request.data)

        # Valida os dados
        if serializer.is_valid():
            course_data = serializer.validated_data

            # Cria o objeto Course e salva as relações ManyToMany de forma simplificada
            course = Course.objects.create(name=course_data['name'])

            # Relacionamentos ManyToMany
            if 'professors' in course_data:
                course.professors.set(course_data['professors'])

            if 'disciplines' in course_data:
                course.disciplines.set(course_data['disciplines'])

            # Serializa novamente para devolver a resposta
            response_serializer = CourseSerializer(course)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        # Retorna erro de validação
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RetrieveCourseByIdAPIView(APIView):
    def get(self, request, course_id, *args, **kwargs):
        try:
            # Busca o curso pelo id
            course = Course.objects.get(id=course_id)

            # Serializa o curso encontrado
            serializer = CourseSerializer(course)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Course.DoesNotExist:
            # Retorna uma mensagem de erro caso o curso não seja encontrado
            return Response({"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND)


class UpdateCourseAPIView(APIView):
    def put(self, request, course_id, *args, **kwargs):
        try:
            # Busca o curso pelo id
            course = Course.objects.get(id=course_id)

            # Serializa os dados recebidos
            serializer = CourseSerializer(course, data=request.data, partial=True)

            # Verifica a validade dos dados
            if serializer.is_valid():
                # Salva o curso sem atualizar ManyToMany ainda
                serializer.save()

                # Atualiza relações ManyToMany se passadas na requisição
                professors_data = request.data.get('professors')
                disciplines_data = request.data.get('disciplines')

                if professors_data:
                    if isinstance(professors_data, list):
                        # Verifica se é uma lista de IDs (não objetos com campo 'id')
                        if isinstance(professors_data[0], dict):
                            professor_ids = [prof['id'] for prof in professors_data]
                        else:
                            professor_ids = professors_data  # Caso seja uma lista de IDs
                        course.professors.set(Servant.objects.filter(id__in=professor_ids))

                if disciplines_data:
                    if isinstance(disciplines_data, list):
                        # Verifica se é uma lista de IDs (não objetos com campo 'id')
                        if isinstance(disciplines_data[0], dict):
                            discipline_ids = [disc['id'] for disc in disciplines_data]
                        else:
                            discipline_ids = disciplines_data  # Caso seja uma lista de IDs
                        course.disciplines.set(Disciplines.objects.filter(id__in=discipline_ids))

                # Retorna o curso atualizado
                return Response(serializer.data, status=status.HTTP_200_OK)

            # Retorna erro de validação
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Course.DoesNotExist:
            # Retorna erro se o curso não for encontrado
            return Response({"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND)

class DeleteCourseAPIView(APIView):
    def delete(self, request, course_id, *args, **kwargs):
        try:
            # Busca o curso pelo ID
            course = Course.objects.get(id=course_id)
            # Deleta o curso
            course.delete()
            return Response({"message": "Course deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Course.DoesNotExist:
            # Retorna erro caso o curso não seja encontrado
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)