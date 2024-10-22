from rest_framework.response import Response

from Dev2.api.serializer.usuario import UsuarioPolymorphicSerializer
from Dev2.users.models import AbstractUser
from .custom_api_view import CustomAPIView


class DetalhesUsuario(CustomAPIView):

    def get(self, request, format=None):

        try:
            usuario = AbstractUser.objects.get(user=request.user)
            print(usuario)
            serializer = UsuarioPolymorphicSerializer(usuario)
            return Response(serializer.data)
        except:
            return Response(False)
