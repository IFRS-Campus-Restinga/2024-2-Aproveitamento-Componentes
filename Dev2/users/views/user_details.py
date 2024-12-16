from rest_framework.response import Response
from users.serializers.user import UserPolymorphicSerializer
from users.models import AbstractUser
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class UserDetails(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):

        try:
            usuario = AbstractUser.objects.get(user=request.user)
            serializer = UserPolymorphicSerializer(usuario)
            return Response(serializer.data)
        except:
            print("Usuário não encontrado")
            return Response({"noUser": True})
