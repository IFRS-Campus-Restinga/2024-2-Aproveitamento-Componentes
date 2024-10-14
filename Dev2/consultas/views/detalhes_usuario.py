from Dev2.consultas.models import usuario
from Dev2.consultas.serializer.usuario import UsuarioPolymorphicSerializer
from .custom_api_view import CustomAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from consultas.models import Usuario,User

class DetalhesUsuario(CustomAPIView):

    def get(self, request, format=None):

        try:
            usuario = Usuario.objects.get(user=request.user)
            print(usuario)
            serializer = UsuarioPolymorphicSerializer(usuario)
            return Response(serializer.data)
        except:
            return Response(False)
                    
