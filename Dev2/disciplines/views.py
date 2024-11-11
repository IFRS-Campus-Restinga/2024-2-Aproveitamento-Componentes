from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .serializers import DisciplinesSerializer
from .models import Disciplines


class ListDisciplinesAPIView(APIView):

    def get(self, request, *args, **kwargs):
        discipline_name = request.GET.get('discipline_name')

        disciplines_filter = Q()

        # Filtro pelo nome da disciplina
        if discipline_name:
            disciplines_filter &= Q(name__icontains=discipline_name)

        # Buscando disciplinas de acordo com os filtros aplicados
        disciplines = Disciplines.objects.filter(disciplines_filter)

        # Serializando os resultados
        disciplines_serialized = DisciplinesSerializer(disciplines, many=True)

        return Response({'disciplines': disciplines_serialized.data})


class RetrieveDisciplineByIdAPIView(APIView):
    def get(self, request, discipline_id, *args, **kwargs):
        try:
            # Busca a disciplina pelo id
            discipline = Disciplines.objects.get(id=discipline_id)

            # Serializa a disciplina encontrada
            serializer = DisciplinesSerializer(discipline)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Disciplines.DoesNotExist:
            # Retorna uma mensagem de erro caso a disciplina não seja encontrada
            return Response({"error": "Disciplines not found."}, status=status.HTTP_404_NOT_FOUND)