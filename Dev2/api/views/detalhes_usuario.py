from rest_framework.response import Response

from api.serializer.usuario import UsuarioPolymorphicSerializer
from users.models import Usuario
from .custom_api_view import CustomAPIView


class DetalhesUsuario(CustomAPIView):

    def get(self, request, format=None):

        try:
            usuario = Usuario.objects.get(user=request.user)
            print(usuario)
            serializer = UsuarioPolymorphicSerializer(usuario)
            return Response(serializer.data)
        except:
            return Response(False)
