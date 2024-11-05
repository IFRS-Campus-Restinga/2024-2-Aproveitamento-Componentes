from django.shortcuts import get_object_or_404
from rest_framework import serializers

from users.models import Student
from .models import Step, Attachment, RecognitionOfPriorLearning, KnowledgeCertification


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
        fields = ['id', 'name', 'type', 'size', 'file']


class RecognitionOfPriorLearningSerializer(serializers.ModelSerializer):
    attachments = AttachmentSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    discipline_name = serializers.CharField(source='discipline.name', read_only=True)
    student_id = serializers.IntegerField(write_only=True)  # Permite a entrada do ID
    student = serializers.PrimaryKeyRelatedField(read_only=True)  # Apenas leitura

    class Meta:
        model = RecognitionOfPriorLearning
        fields = [
            'id', 'course_workload', 'course_studied_workload', 'test_score', 'notice', 'discipline',
            'discipline_name', 'create_date', 'status_display', 'servant_feedback', 'servant_analysis_date',
            'professor_feedback', 'professor_analysis_date', 'coordinator_feedback', 'coordinator_analysis_date',
            'attachments', 'student_id', 'student'
        ]

    def create(self, validated_data):
        student_id = validated_data.pop('student_id')
        student = get_object_or_404(Student, id=student_id)  # Certifique-se de que o ID é válido
        requisition = RecognitionOfPriorLearning.objects.create(student=student, **validated_data)
        return requisition


class KnowledgeCertificationSerializer(serializers.ModelSerializer):
    attachments = AttachmentSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    discipline_name = serializers.CharField(source='discipline.name', read_only=True)
    student_id = serializers.IntegerField(write_only=True)  # Permite a entrada do ID
    student = serializers.PrimaryKeyRelatedField(read_only=True)  # Apenas leitura

    class Meta:
        model = KnowledgeCertification
        fields = [
            'id', 'previous_knowledge', 'scheduling_date', 'test_score', 'notice', 'discipline',
            'discipline_name', 'create_date', 'status_display', 'servant_feedback', 'servant_analysis_date',
            'professor_feedback', 'professor_analysis_date', 'coordinator_feedback', 'coordinator_analysis_date',
            'attachments', 'student_id', 'student'
        ]

    def create(self, validated_data):
        student_id = validated_data.pop('student_id')
        student = get_object_or_404(Student, id=student_id)  # Certifique-se de que o ID é válido
        certification = KnowledgeCertification.objects.create(student=student, **validated_data)
        return certification