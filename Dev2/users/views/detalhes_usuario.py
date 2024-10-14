from Dev2.users.serializer.usuario import UsuarioPolymorphicSerializer
from .custom_api_view import CustomAPIView
from rest_framework.response import Response
from Dev2.users.models.usuario import Usuario


class DetalhesUsuario(CustomAPIView):

    def get(self, request, format=None):

        try:
            usuario = Usuario.objects.get(user=request.user)
            print(usuario)
            serializer = UsuarioPolymorphicSerializer(usuario)
            return Response(serializer.data)
        except:
            return Response(False)
                    
