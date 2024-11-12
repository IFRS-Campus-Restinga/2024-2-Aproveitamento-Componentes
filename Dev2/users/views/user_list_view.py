from rest_framework.views import APIView
from rest_framework.response import Response
from ..models.student import Student
from ..models.servant import Servant
from api.views.custom_api_view import CustomAPIView
from users.models.user import AbstractUser
from ..serializers.user import UserPolymorphicSerializer, UserSerializer
from django.db.models import Q



class ListUsersAPIView(APIView):

    def get(self, request, format=None):
        """
        Retorna uma lista de todos os usuários.
        """
        # Get filter parameters
        user_type_param = request.GET.get("user_type")
        name = request.GET.get("name")
        is_active = request.GET.get("is_active")

        if user_type_param == "Student":
            queryset = Student.objects.all()
        elif user_type_param:
            queryset = Servant.objects.filter(servant_type=user_type_param)
        else:
            # Get all users
            queryset = AbstractUser.objects.all()

        if name:
            # Case-insensitive partial match on name
            queryset = queryset.filter(name__icontains=name)

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)

        serializer = UserPolymorphicSerializer(queryset, many=True)
        return Response(serializer.data)


class ListUserAPIView(APIView):

    def get(self, request, *args, **kwargs):
        user_name = request.GET.get('user_name')

        users_filter = Q()

        # Filtro pelo nome da disciplina
        if user_name:
            users_filter &= Q(name__icontains=user_name)

        # Buscando disciplinas de acordo com os filtros aplicados
        users = AbstractUser.objects.filter(users_filter)

        # Serializando os resultados
        users_serialized = UserSerializer(users, many=True)

        return Response({'disciplines': users_serialized.data})