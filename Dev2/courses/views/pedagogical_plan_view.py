from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

from users.serializers import ServantSerializer
from ..models import Course
from ..models import pedagogical_plan as PedagogicalPlan
from ..serializers.PedagogicalPlanSerializer import PedagogicalPlanSerializer
from disciplines.models import Disciplines
from users.models import Servant
from users.services.user import UserService

class ListPedagogicalPlansAPIView(APIView):

    def get(self, request, *args, **kwargs):

        pedagogicalPlan_name = request.GET.get('pedagogicalPlan_name')

        pedagogicalPlan_filter = Q()

        if pedagogicalPlan_name:
            pedagogicalPlan_filter &= Q(name__icontains=pedagogicalPlan_name)

        # Buscando planos pedagogicos de acordo com os filtros aplicados
        pedagogicalPlans = PedagogicalPlan.objects.filter(pedagogicalPlan_filter)

        # Serializando os resultados
        pedagogicalPlans_serialized = PedagogicalPlanSerializer(pedagogicalPlans, many=True)

        return Response({'planos pedagogicos': pedagogicalPlans_serialized.data})


class CreatePedagogicalPlanAPIView(APIView):

    permission_classes = [IsAuthenticated]
    user_service = UserService()

    def post(self, request, *args, **kwargs):
        serializer = PedagogicalPlanSerializer(data=request.data)
        usuario = request.user

        if not self.user_service.userAutorizedEnsino(usuario):
            return Response(
                {"detail": "Usuário não autorizado"},
                status=status.HTTP_403_FORBIDDEN
            )

        if serializer.is_valid():
            pedagogicalPlan_data = serializer.validated_data
            coordinator = None

            if pedagogicalPlan_data.get('coordinator_id', None) is not None:
                # Verificar coordenador
                coordinator_id = pedagogicalPlan_data.get('coordinator_id', None).id

                if coordinator_id:
                    coordinator = Servant.objects.get(id=coordinator_id)

            # Cria o objeto Course e salva as relações ManyToMany de forma simplificada
            pedagogicalPlan = PedagogicalPlan.objects.create(
                name=pedagogicalPlan_data['name'],
                coordinator=coordinator,
            )

            # Relacionamentos ManyToMany
            if 'courses' in pedagogicalPlan_data:
                pedagogicalPlan.courses.set(pedagogicalPlan_data['courses'])

            if 'disciplines' in pedagogicalPlan_data:
                pedagogicalPlan.disciplines.set(pedagogicalPlan_data['disciplines'])

            # Serializa novamente para devolver a resposta
            response_serializer = PedagogicalPlanSerializer(pedagogicalPlan)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        print(serializer.errors)
        # Retorna erro de validação
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UpdatePedagogicalPlanAPIView(APIView):

    permission_classes = [IsAuthenticated]
    user_service = UserService()

    def put(self, request, pedagogicalPlan_id, *args, **kwargs):
        usuario = request.user

        if not self.user_service.userAutorized(usuario):
            return Response(
                {"detail": "Usuário não autorizado"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            # Busca o curso pelo ID
            pedagogicalPlan = PedagogicalPlan.objects.get(id=pedagogicalPlan_id)
            # Serializa os dados recebidos
            serializer = PedagogicalPlanSerializer(pedagogicalPlan, data=request.data, partial=True)

            # Verifica a validade dos dados
            if serializer.is_valid():
                # Verifica o coordenador se fornecido
                coordinator_id = serializer.validated_data.get('coordinator_id', None)
                if coordinator_id:
                    # Verifica se o coordenador já está associado a outro curso
                    if PedagogicalPlan.objects.filter(coordinator_id=coordinator_id).exclude(id=pedagogicalPlan.id).exists():
                        return Response(
                            {"detail": "Este coordenador já está associado a outro curso."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    # Atualiza o coordenador no objeto `course`
                    pedagogicalPlan.coordinator_id = coordinator_id

                # Salva o curso sem atualizar ManyToMany ainda
                pedagogicalPlan.name = serializer.validated_data.get('name', pedagogicalPlan.name)
                pedagogicalPlan.save()

                # Atualiza relações ManyToMany se passadas na requisição
                courses_data = request.data.get('courses')
                disciplines_data = request.data.get('disciplines')

                if courses_data:
                    if isinstance(courses_data, list):
                        # Verifica se é uma lista de IDs (ou objetos com campo 'id')
                        if isinstance(courses_data[0], dict):
                            courses_id = [cour['id'] for cour in courses_data]
                        else:
                            courses_id = courses_data  # Lista direta de IDs
                        pedagogicalPlan.professors.set(Servant.objects.filter(id__in=courses_id))

                if disciplines_data:
                    if isinstance(disciplines_data, list):
                        # Verifica se é uma lista de IDs (ou objetos com campo 'id')
                        if isinstance(disciplines_data[0], dict):
                            discipline_ids = [disc['id'] for disc in disciplines_data]
                        else:
                            discipline_ids = disciplines_data  # Lista direta de IDs
                        pedagogicalPlan.disciplines.set(Disciplines.objects.filter(id__in=discipline_ids))

                # Retorna o curso atualizado
                updated_course = PedagogicalPlanSerializer(pedagogicalPlan)
                return Response(updated_course.data, status=status.HTTP_200_OK)

            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except PedagogicalPlan.DoesNotExist:
            return Response({"error": "Pedagogical Plan not found."}, status=status.HTTP_404_NOT_FOUND)


class DeletePedagogicalPlanAPIView(APIView):

    permission_classes = [IsAuthenticated]
    user_service = UserService()

    def delete(self, request, pedagogicalPlan_id, *args, **kwargs):
        usuario = request.user

        if not self.user_service.userAutorizedEnsino(usuario):
            return Response(
                {"detail": "Usuário não autorizado"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            # Busca o curso pelo ID
            pedagogicalPlan = PedagogicalPlan.objects.get(id=pedagogicalPlan_id)
            # Deleta o curso
            pedagogicalPlan.delete()
            return Response({"message": "Pedagogical Plan deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except PedagogicalPlan.DoesNotExist:
            # Retorna erro caso o curso não seja encontrado
            return Response({"error": "Pedagogical Plan not found"}, status=status.HTTP_404_NOT_FOUND)


# class PedagogicalPlanCoursesView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, coordinator_id, *args, **kwargs):
#         coordinator = get_object_or_404(Servant, id=coordinator_id)
#         pedagogicalPlan = get_object_or_404(PedagogicalPlan, coordinator=coordinator)

#         if pedagogicalPlan.coordinator.id != coordinator.id:
#             return Response({'detail': 'Você não tem permissão para acessar este curso.'}, status=403)

#         professors = pedagogicalPlan.professors.all()
#         serializer = ServantSerializer(professors, many=True)

#         return Response(serializer.data)