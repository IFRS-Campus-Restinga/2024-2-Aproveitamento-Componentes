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
        fields = ['id', 'file_name', 'content_type', 'certification_form', 'recognition_form']
        
    def create(self, validated_data):
        file = validated_data.pop('file')
        certification_form = validated_data.pop('certification_form', None)
        recognition_form = validated_data.pop('recognition_form', None)
        attachment = Attachment(
            file_name=file.name,
            file_data=file.read(),
            content_type=file.content_type,
            certification_form=certification_form,
            recognition_form=recognition_form,
            **validated_data
        )
        attachment.save()
        return attachment


class RecognitionOfPriorLearningSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    discipline_name = serializers.CharField(source='discipline.name', read_only=True)
    student_id = serializers.IntegerField(write_only=True)
    student = serializers.PrimaryKeyRelatedField(read_only=True)
    student_name = serializers.SerializerMethodField()
    student_email = serializers.SerializerMethodField()
    student_matricula = serializers.CharField(source='student.matricula', read_only=True)
    student_course = serializers.CharField(source='student.course', read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = RecognitionOfPriorLearning
        fields = [
            'id', 'course_workload', 'course_studied_workload', 'test_score', 'notice', 'discipline',
            'discipline_name', 'create_date', 'status_display', 'servant_feedback', 'servant_analysis_date',
            'professor_feedback', 'professor_analysis_date', 'coordinator_feedback', 'coordinator_analysis_date',
            'attachments', 'student_id', 'student', 'student', 'student_name', 'student_email', 'student_matricula',
            'student_course'
        ]

    def get_student_name(self, obj):
        return obj.student.name if obj.student else None

    def get_student_email(self, obj):
        return obj.student.email if obj.student else None

    def create(self, validated_data):
        attachments_files = self.context['request'].FILES.getlist('attachment')
        student_id = validated_data.pop('student_id')
        student = get_object_or_404(Student, id=student_id)
        requisition = RecognitionOfPriorLearning.objects.create(student=student, **validated_data)

        for attachment_file in attachments_files:
            Attachment.objects.create(
                file_name=attachment_file.name,
                file_data=attachment_file.read(),
                content_type=attachment_file.content_type,
                recognition_form=requisition
            )

        return requisition


class KnowledgeCertificationSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    discipline_name = serializers.CharField(source='discipline.name', read_only=True)
    student_id = serializers.IntegerField(write_only=True)
    student = serializers.PrimaryKeyRelatedField(read_only=True)
    student_name = serializers.SerializerMethodField()
    student_email = serializers.SerializerMethodField()
    student_matricula = serializers.CharField(source='student.matricula', read_only=True)
    student_course = serializers.CharField(source='student.course', read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = KnowledgeCertification
        fields = [
            'id', 'previous_knowledge', 'scheduling_date', 'test_score', 'notice', 'discipline',
            'discipline_name', 'create_date', 'status_display', 'servant_feedback', 'servant_analysis_date',
            'professor_feedback', 'professor_analysis_date', 'coordinator_feedback', 'coordinator_analysis_date',
            'attachments', 'student_id', 'student', 'student_name', 'student_email', 'student_matricula',
            'student_course'
        ]

    def get_student_name(self, obj):
        return obj.student.name if obj.student else None

    def get_student_email(self, obj):
        return obj.student.email if obj.student else None

    def create(self, validated_data):
        attachments_files = self.context['request'].FILES.getlist('attachment')
        student_id = validated_data.pop('student_id')
        student = get_object_or_404(Student, id=student_id)
        certification = KnowledgeCertification.objects.create(student=student, **validated_data)
        for attachment_file in attachments_files:
            Attachment.objects.create(
                file_name=attachment_file.name,
                file_data=attachment_file.read(),
                content_type=attachment_file.content_type,
                certification_form=certification
            )

        return certification