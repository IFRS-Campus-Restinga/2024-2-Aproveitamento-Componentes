from rest_framework import serializers

from users.models import Servant
from users.serializers import ServantSerializer
from ..models import pedagogical_plan


class PedagogicalPlanSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = pedagogical_plan
        fields = ['id', 'name', 'authorization', 'year', 'start_duration', 'end_duration', 'total_workload', 'duration', "turn", 'courses', 'disciplines']
