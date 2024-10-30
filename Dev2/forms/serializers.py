from rest_framework import serializers
from .models import *
from users.serializers.user import StudentSerializer
from disciplines.serializers import DisciplinesSerializer

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


class RequisitionFormSerializer(serializers.ModelSerializer):
    user = StudentSerializer()
    discipline = DisciplinesSerializer()
    step = StepSerializer()
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        fields = [
            'id', 'step', 'student', 'discipline', 'create_date', 'status',
            'servant_feedback', 'servant_analysis_date',
            'professor_feedback', 'professor_analysis_date',
            'coordinator_feedback', 'coordinator_analysis_date', 'attachments'
        ]

class RecognitionOfPriorLearningSerializer(RequisitionFormSerializer):
    class Meta(RequisitionFormSerializer.Meta):
        model = RecognitionOfPriorLearning
        fields = RequisitionFormSerializer.Meta.fields + [
            'course_workload', 'test_score', 'course_studied_workload'
        ]


class KnowledgeCertificationSerializer(RequisitionFormSerializer):
    class Meta(RequisitionFormSerializer.Meta):
        model = KnowledgeCertification
        fields = RequisitionFormSerializer.Meta.fields + [
            'previous_knowledge', 'scheduling_date', 'test_score'
        ]