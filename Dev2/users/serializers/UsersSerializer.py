from rest_framework import serializers
from ..models import Student, Servant
from rest_polymorphic.serializers import PolymorphicSerializer
from ..models import AbstractUser

"""
class UserTypeField(serializers.Field):
    def to_representation(self, value):
        return value  # Retorna o valor do enum

    def to_internal_value(self, data):
        try:
            return UserTypeEnum(data)
        except ValueError:
            raise serializers.ValidationError(f"Invalid user type: {data}")

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'email', 'is_active', 'registration', 'entry_date']


class ServantSerializer(serializers.ModelSerializer):
    user_type = UserTypeField()

    class Meta:
        model = Servant
        fields = ['id', 'name', 'email', 'is_active', 'siape', 'user_type']

 """
class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Usuario.

    Atributos:
        tipo (CharField): Tipo de usuário.
    """
    tipo = serializers.CharField(source='tipoString', read_only=True)

    class Meta:
        model = AbstractUser
        fields = '__all__'

class StudentSerializer(UserSerializer):
    """
    Serializer para o modelo Estudante.
    """
    class Meta:
        model = Student
        fields = '__all__'

class ServantSerializer(UserSerializer):
    """
    Serializer para o modelo Servidor.
    """
    class Meta:
        model = Servant
        fields = '__all__'

class UserPolymorphicSerializer(PolymorphicSerializer):
    """
    Serializer polimórfico para os modelos de usuário.
    """
    model_serializer_mapping = {
        AbstractUser: UserSerializer,
        Student: StudentSerializer,
        Servant: ServantSerializer
    }



