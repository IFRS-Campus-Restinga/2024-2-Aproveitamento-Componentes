from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q
from rest_framework.filters import SearchFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from ..models import PedagogicalPlanCourse
from ..serializers import PedagogicalPlanCourseSerializer

from rest_framework.permissions import BasePermission
from users.enum.servant_type_enum import ServantTypeEnum
from users.enum.user_type_enum import UserTypeEnum

# class IsSpecificUserType(BasePermission):
#     """
#     Permissão baseada no tipo de usuário.
#     Apenas usuários do tipo específico (ex.: Servidor - Coordenador, Ensino, Professor) podem editar.
#     """
#     def has_permission(self, request, view):
#         # Permitir acesso de leitura para todos
#         if request.method in ["GET", "HEAD", "OPTIONS"]:
#             return True

#         # Garantir que o usuário está autenticado
#         if not request.user.is_authenticated:
#             return False

#         # Acessar o perfil do usuário e verificar o tipo
#         user_profile = getattr(request.user, 'perfil', None)

#         if not user_profile:
#             return False  # Usuário sem perfil vinculado

#         # Verificar se é um Servidor e possui um tipo válido
#         if user_profile.type == UserTypeEnum.SERVANT:
#             # Tipos permitidos
#             allowed_types = [
#                 ServantTypeEnum.COORDINATOR.value,
#                 ServantTypeEnum.ENSINO.value,
#                 ServantTypeEnum.TEACHER.value,
#             ]
#             return user_profile.servant_type in allowed_types

#         return False  # Outros tipos de usuário não têm permissão


class PedagogicalPlanCourseListCreateView(ListCreateAPIView):
    queryset = PedagogicalPlanCourse.objects.all()
    serializer_class = PedagogicalPlanCourseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ["name", "course__name", "disciplines__name"]

    def get_queryset(self):
        # Filtro por data de vigência (start_duration <= hoje <= end_duration)
        active = self.request.query_params.get("active", None)
        queryset = super().get_queryset()
        if active == "true":
            queryset = queryset.filter(start_duration__lte=timezone.now(), end_duration__gte=timezone.now())
        return queryset

class PedagogicalPlanCourseRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    print("CHEGOU EM PedagogicalPlanCourseRetrieveUpdateDestroyView")
    queryset = PedagogicalPlanCourse.objects.all()
    serializer_class = PedagogicalPlanCourseSerializer
    permission_classes = [IsAuthenticated]
