from rest_framework import serializers
from ..models import Student, Servant
from rest_polymorphic.serializers import PolymorphicSerializer
from ..models import AbstractUser


class UserSerializer(serializers.ModelSerializer):

    type = serializers.CharField(source="typeString", read_only=True)

    class Meta:
        model = AbstractUser
        fields = "__all__"


class StudentSerializer(UserSerializer):

    class Meta:
        model = Student
        fields = "__all__"


class ServantSerializer(UserSerializer):

    class Meta:
        model = Servant
        fields = "__all__"


class UserPolymorphicSerializer(PolymorphicSerializer):

    model_serializer_mapping = {
        AbstractUser: UserSerializer,
        Student: StudentSerializer,
        Servant: ServantSerializer,
    }


class CreateUserSerializer(serializers.Serializer):

    name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    matricula = serializers.CharField(required=False, allow_blank=True)
    course = serializers.CharField(required=False, allow_blank=True)
    is_student = serializers.BooleanField(default=False)
    siape = serializers.CharField(required=False, allow_blank=True)
    servant_type = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):

        is_student = data.get("is_student", False)
        
        return data
