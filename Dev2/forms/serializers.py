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
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    discipline_name = serializers.CharField(source='discipline.name', read_only=True)
    student = serializers.ModelSerializer(source='student', read_only=True)

    class Meta:
        model = RecognitionOfPriorLearning
        fields = [
            'id', 'course_workload', 'course_studied_workload', 'test_score', 'notice', 'discipline',
            'discipline_name', 'create_date', 'status_display', 'servant_feedback', 'servant_analysis_date',
            'professor_feedback', 'professor_analysis_date', 'coordinator_feedback', 'coordinator_analysis_date',
            'attachments', 'student'
        ]

    def create(self, validated_data):
        # Extraindo os attachments, se houver
        attachments_data = validated_data.pop('attachments', [])
        requisition = RecognitionOfPriorLearning.objects.create(**validated_data)
        # Se attachments existirem, adicione-os
        for attachment in attachments_data:
            Attachment.objects.create(requisition=requisition, **attachment)  # Certifique-se de que a relação está definida
        return requisition

class KnowledgeCertificationSerializer(serializers.ModelSerializer):
    attachments = AttachmentSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    discipline_name = serializers.CharField(source='discipline.name', read_only=True)

    class Meta:
        model = KnowledgeCertification
        fields = [
            'id', 'previous_knowledge', 'scheduling_date', 'test_score', 'notice', 'discipline',
            'discipline_name', 'create_date', 'status_display', 'servant_feedback', 'servant_analysis_date',
            'professor_feedback', 'professor_analysis_date', 'coordinator_feedback', 'coordinator_analysis_date',
            'attachments'
        ]

    def create(self, validated_data):
        # Extraindo os attachments, se houver
        attachments_data = validated_data.pop('attachments', [])
        certification = KnowledgeCertification.objects.create(**validated_data)
        # Se attachments existirem, adicione-os
        for attachment in attachments_data:
            Attachment.objects.create(certification=certification, **attachment)  # Certifique-se de que a relação está definida
        return certification
