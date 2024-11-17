from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers.user import CreateUserSerializer, UserPolymorphicSerializer
from ..services.user import UserService
from ..models import AbstractUser


class CreateUserView(APIView):

    parser_classes = (MultiPartParser, FormParser)
    user_service = UserService()

    def post(self, request):
        usuario = request.user
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            criarUsuario = self.user_service.createUser(usuario, serializer)
            if criarUsuario is not None:
                return Response({"id": usuario.id}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class UpdateActiveByIdView(APIView):

   def get(self, request, id):
        #if usuario type is coordenador ou ensino
        user = AbstractUser.objects.get(id=id)
        if user is None:
            return Response({'not ok'}, status=status.HTTP_400_BAD_REQUEST)
        user.is_active = not user.is_active
        user.save()
        return Response({'ok'},status=status.HTTP_201_CREATED)
class UpdateUserByIdView(APIView):

    parser_classes = (MultiPartParser, FormParser)
    user_service = UserService()

    def put(self, request, id):
        usuario = request.user
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            updated = self.user_service.updateUserById(id, serializer, usuario)
            if updated is not None:
                updated = UserPolymorphicSerializer(updated)
                return Response({"id": updated.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
