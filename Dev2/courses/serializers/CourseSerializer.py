from rest_framework import serializers

from users.models import Servant
from users.serializers import ServantSerializer
from ..models import Course


class CourseSerializer(serializers.ModelSerializer):
    coordinator_id = serializers.PrimaryKeyRelatedField(queryset=Servant.objects.all(), required=False)
    coordinator = ServantSerializer(read_only=True, allow_null=True)

    class Meta:
        model = Course
        fields = ['id', 'name', 'professors', 'disciplines', 'coordinator', 'coordinator_id']

    def update(self, instance, validated_data):
        coordinator_data = validated_data.pop('coordinator_id', None)
        if coordinator_data:
            instance.coordinator = coordinator_data
        return super().update(instance, validated_data)