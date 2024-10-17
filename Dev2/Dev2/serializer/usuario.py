from rest_framework import serializers
from consultas.models import Usuario, Estudante
from rest_polymorphic.serializers import PolymorphicSerializer


class UsuarioSerializer(serializers.ModelSerializer):

    class Meta:
        model = Usuario
        fields = '__all__'


class EstudanteSerializer(UsuarioSerializer):

    class Meta:
        model = Estudante
        fields = '__all__'

class UsuarioPolymorphicSerializer(PolymorphicSerializer):

    model_serializer_mapping = {
        Usuario: UsuarioSerializer,
        Estudante: EstudanteSerializer,
    }

class CriarUsuarioSerializer(serializers.Serializer):

    nome = serializers.CharField()
    email = serializers.EmailField()
    isProfessor = serializers.BooleanField(required=False, default=False)
    IsInterno = serializers.BooleanField(required=False, default=False)
    matricula = serializers.CharField(required=False, allow_blank=True)




