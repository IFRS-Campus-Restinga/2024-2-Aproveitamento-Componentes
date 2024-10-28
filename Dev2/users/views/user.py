from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers.user import CreateUserSerializer
from ..services.user import UserService

class CreateUserView(APIView):

    parser_classes = (MultiPartParser, FormParser)
    user_service = UserService()

    def post(self, request):
        usuario = request.user
        print(usuario)
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            criarUsuario = self.user_service.createUser(usuario, serializer)
            if criarUsuario is not None:
                return Response({"id": usuario.id}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)