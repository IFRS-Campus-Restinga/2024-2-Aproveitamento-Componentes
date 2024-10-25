from rest_framework import serializers
from .models import RequisitionForm, Step

class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ['id', 'notice_id', 'student_id', 'responsible_id', 'description', 'initial_step_date', 'final_step_date']


class RequisitionFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequisitionForm
        fields = ['id', 'step', 'create_date', 'status', 'servant_feedback', 'servant_analysis_date',
                  'professor_feedback', 'professor_analysis_date', 'coordinator_feedback', 'coordinator_analysis_date']
