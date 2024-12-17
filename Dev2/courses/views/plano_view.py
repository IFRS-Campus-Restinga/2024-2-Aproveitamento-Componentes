from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from ..models.planoPedagogicoCurso import PlanoPedagogicoCurso
from ..serializers import PlanoSerializer
from rest_framework.permissions import IsAuthenticated
# from users.services.user import UserService


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def plano_list_create(request):
    # user_service = UserService()

    if request.method == 'GET':
        planos = PlanoPedagogicoCurso.objects.all()
        serializer = PlanoSerializer(planos, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # usuario = request.user
        # if not user_service.userAutorized(usuario):
        #     return Response({"detail": "Usuário não autorizado para criar disciplinas."},
        #                     status=status.HTTP_403_FORBIDDEN)

        serializer = PlanoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def plano_detail(request, pk):
    # user_service = UserService()

    try:
        plano = PlanoPedagogicoCurso.objects.get(pk=pk)
    except PlanoPedagogicoCurso.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.method == 'GET':
        serializer = PlanoSerializer(plano)
        return Response(serializer.data)

    # validação
    # usuario = request.user
    # if not user_service.userAutorized(usuario):
    #     return Response({"detail": "Usuário não autorizado."},
    #                     status=status.HTTP_403_FORBIDDEN)

    elif request.method == 'PUT':
        serializer = PlanoSerializer(plano, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        plano.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)