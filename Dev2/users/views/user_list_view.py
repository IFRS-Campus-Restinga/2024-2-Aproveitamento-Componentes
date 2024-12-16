from rest_framework.views import APIView
from rest_framework.response import Response
from ..models.student import Student
from ..models.servant import Servant
from api.views.custom_api_view import CustomAPIView
from users.models.user import AbstractUser
from ..serializers.user import UserPolymorphicSerializer
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated


class ListUsersAPIView(APIView):

    permission_classes = [IsAuthenticated]

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
