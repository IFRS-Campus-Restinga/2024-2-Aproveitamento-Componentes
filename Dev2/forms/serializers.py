from rest_framework import serializers

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
    status = serializers.CharField(source='get_status_display')
    discipline_name = serializers.CharField(source='discipline.name', read_only=True)

    class Meta:
        model = RecognitionOfPriorLearning
        fields = [
            'id', 'course_workload', 'course_studied_workload', 'test_score', 'notice', 'discipline',
            'discipline_name', 'create_date', 'status', 'servant_feedback', 'servant_analysis_date',
            'professor_feedback', 'professor_analysis_date', 'coordinator_feedback', 'coordinator_analysis_date',
            'attachments'
        ]


class KnowledgeCertificationSerializer(serializers.ModelSerializer):
    attachments = AttachmentSerializer(many=True, read_only=True)
    status = serializers.CharField(source='get_status_display')
    discipline_name = serializers.CharField(source='discipline.name', read_only=True)

    class Meta:
        model = KnowledgeCertification
        fields = [
            'id', 'previous_knowledge', 'scheduling_date', 'test_score', 'notice', 'discipline',
            'discipline_name', 'create_date', 'status', 'servant_feedback', 'servant_analysis_date',
            'professor_feedback', 'professor_analysis_date', 'coordinator_feedback', 'coordinator_analysis_date',
            'attachments'
        ]
