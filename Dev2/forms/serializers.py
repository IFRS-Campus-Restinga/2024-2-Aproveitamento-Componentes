from rest_framework import serializers

from .models import *


class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = [
            'id', 'notice_id', 'student_id', 'responsible_id',
            'description', 'initial_step_date', 'final_step_date'
        ]


class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ['id', 'requisition_form', 'name', 'type', 'size', 'file']


class RecognitionOfPriorLearningSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecognitionOfPriorLearning
        fields = ['id', 'course_workload', 'course_studied_workload', 'notice', 'discipline']


class KnowledgeCertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeCertification
        fields = [
            'id', 'previous_knowledge', 'notice', 'discipline'
        ]
