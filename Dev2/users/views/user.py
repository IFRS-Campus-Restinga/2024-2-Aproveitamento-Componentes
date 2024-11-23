from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers.user import CreateUserSerializer, UserPolymorphicSerializer
from ..services.user import UserService
from ..models import AbstractUser
from rest_framework.permissions import IsAuthenticated


class CreateUserView(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    user_service = UserService()

    def post(self, request):
        usuario = request.user
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            criar_usuario = self.user_service.createUser(usuario, serializer)
            if criar_usuario is not None:
                return Response({"id": usuario.id}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateActiveByIdView(APIView):

    permission_classes = [IsAuthenticated]
    user_service = UserService()

    def get(self, request, id):
        usuario = request.user
        user_autorized = self.user_service.userAutorized(usuario)
        user = AbstractUser.objects.get(id=id)
        if not user_autorized:
            return Response({'not ok'}, status=status.HTTP_400_BAD_REQUEST)
        user.is_active = not user.is_active
        user.save()
        return Response({'ok'},status=status.HTTP_201_CREATED)
   
class UpdateUserByIdView(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    user_service = UserService()

    def put(self, request, id):
        usuario = request.user
        user_autorized = self.user_service.userAutorized(usuario)
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            updated = self.user_service.updateUserById(id, serializer, usuario, user_autorized)
            if updated is None:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            updated = UserPolymorphicSerializer(updated)
            return Response({"id": updated.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
