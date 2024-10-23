from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from ..models.student import Student
from ..models.servant import Servant
from ..serializers.UsersSerializer import StudentSerializer
from api.views.custom_api_view import CustomAPIView
from users.models.user import AbstractUser
from ..serializers.UsersSerializer import UserPolymorphicSerializer


class ListUsersAPIView(CustomAPIView):
 """
    def get(self, request, *args, **kwargs):
        user_type = request.GET.get('user_type')
        name = request.GET.get('name')
        is_active = request.GET.get('is_active')

        students_filter = Q()
        servants_filter = Q()

        # Filtrando os usuários de acordo com o tipo
        if user_type == 'Aluno':
            servants_filter &= Q(pk__isnull=True)  # Exclui Servant
        elif user_type:
            students_filter &= Q(pk__isnull=True)  # Exclui Student
            servants_filter &= Q(user_type=user_type)

        # Filtro de nome
        if name:
            students_filter &= Q(name__icontains=name)
            servants_filter &= Q(name__icontains=name)

        # Filtro de status ativo
        if is_active is not None:
            is_active_bool = is_active.lower() == 'true'
            students_filter &= Q(is_active=is_active_bool)
            servants_filter &= Q(is_active=is_active_bool)

        # Buscando estudantes e servidores de acordo com os filtros
        students = Student.objects.filter(students_filter)
        servants = Servant.objects.filter(servants_filter)

        # Serializando os resultados
        students_serialized = StudentSerializer(students, many=True)
        servants_serialized = ServantSerializer(servants, many=True)

        # Unindo os dois conjuntos de dados
        users = students_serialized.data + servants_serialized.data
 """
 def get(self, request, format=None):
        """
        Retorna uma lista de todos os usuários.
        """
        usuario = AbstractUser.objects.all()
        serializer = UserPolymorphicSerializer(usuario, many=True)
        return Response(serializer.data)
