from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Disciplines
from .serializers import DisciplineSerializer

@api_view(['GET', 'POST'])
def discipline_list_create(request):
    if request.method == 'GET':
        disciplines = Disciplines.objects.all()
        serializer = DisciplineSerializer(disciplines, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DisciplineSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def discipline_detail(request, pk):
    try:
        discipline = Disciplines.objects.get(pk=pk)
    except Disciplines.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DisciplineSerializer(discipline)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = DisciplineSerializer(discipline, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        discipline.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)