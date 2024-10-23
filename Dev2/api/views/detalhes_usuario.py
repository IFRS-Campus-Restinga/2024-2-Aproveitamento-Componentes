from rest_framework.response import Response

from users.serializers.UsersSerializer import UserPolymorphicSerializer
from users.models import AbstractUser
from .custom_api_view import CustomAPIView


class DetalhesUsuario(CustomAPIView):

    def get(self, request, format=None):

        try:
            usuario = AbstractUser.objects.get(user=request.user)
            print(usuario)
            serializer = UserPolymorphicSerializer(usuario)
            return Response(serializer.data)
        except:
            return Response(False)
