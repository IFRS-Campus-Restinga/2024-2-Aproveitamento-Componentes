from rest_framework import serializers
from ..models import Servant, Student
from ..models.enums import UserTypeEnum


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