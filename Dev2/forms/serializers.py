from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers

from users.models import Servant, AbstractUser
from users.models import Student
from .models import Step, Attachment, RecognitionOfPriorLearning, KnowledgeCertification, \
    RequestStatus, FAILED_STATUS, ANALYSIS_STATUS, STUDENT_STATUS, CRE_STATUS, COORD_STATUS, PROF_STATUS


class StepSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Step
        fields = [
            'id', 'status', 'status_display', 'responsible_id', 'feedback', 'initial_step_date', 'final_step_date',
            'current', 'recognition_form', 'certification_form'
        ]

    def validate(self, data):
        recognition_form = data.get('recognition_form')
        certification_form = data.get('certification_form')

        if (recognition_form and certification_form) or (not recognition_form and not certification_form):
            raise serializers.ValidationError(
                "Deve ser fornecida uma requisição"
            )

        latest_step = None
        if recognition_form:
            latest_step = Step.objects.filter(recognition_form=recognition_form).order_by('-initial_step_date').first()
        elif certification_form:
            latest_step = Step.objects.filter(certification_form=certification_form).order_by(
                '-initial_step_date').first()

        status = data.get('status')

        if not status:
            raise serializers.ValidationError("Status é obrigatório para a criação")

        current_status = None

        if latest_step:
            current_status = latest_step.status

        user = self.context.get('user')
        abstract_user = AbstractUser.objects.filter(user_id=user.id).first()
        responsible_id = abstract_user.id
        data['responsible_id'] = responsible_id

        if not user:
            raise serializers.ValidationError("Usuário não autenticado")

        servant = Servant.objects.filter(id=responsible_id).first()
        student = Student.objects.filter(id=responsible_id).first()
        user_role = servant.servant_type if servant else 'Aluno'

        if not servant and not student:
            raise serializers.ValidationError("Erro ao identificar o tipo de usuário")

        if user_role != 'Professor' and data.get('test_score'):
            raise serializers.ValidationError("Apenas o professor pode alterar a nota")

        if user_role != 'Professor' and data.get('scheduling_date'):
            raise serializers.ValidationError("Apenas o professor pode agendar a prova")

        if current_status in FAILED_STATUS or current_status == RequestStatus.APPROVED_BY_CRE:
            if status != current_status:
                raise serializers.ValidationError("Não é permitido alterar o status após finalização")

        if user_role == 'Aluno':
            if status not in STUDENT_STATUS:
                raise serializers.ValidationError(f"Aluno não pode definir o status como '{status}'.")

        elif user_role == 'Ensino':
            if status not in CRE_STATUS:
                raise serializers.ValidationError(f"CRE não pode definir o status como '{status}'.")

        elif user_role == 'Coordenador':
            if status not in COORD_STATUS:
                raise serializers.ValidationError(f"Coordenador não pode definir o status como '{status}'.")

        elif user_role == 'Professor':
            if status not in PROF_STATUS:
                raise serializers.ValidationError(f"Professor não pode definir o status como '{status}'.")

        if status not in [ANALYSIS_STATUS] and status != RequestStatus.CANCELED:
            if not data.get('feedback'):
                raise serializers.ValidationError("É necessário informar um feedback")

        if latest_step:
            latest_step.final_step_date = timezone.now()
            latest_step.current = False
            latest_step.save()

        return data


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
    status_display = serializers.SerializerMethodField(read_only=True)
    discipline_name = serializers.CharField(source='discipline.name', read_only=True)
    student_id = serializers.IntegerField(write_only=True)
    student = serializers.PrimaryKeyRelatedField(read_only=True)
    student_name = serializers.SerializerMethodField()
    student_email = serializers.SerializerMethodField()
    student_matricula = serializers.CharField(source='student.matricula', read_only=True)
    student_course = serializers.CharField(source='student.course', read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)
    steps = StepSerializer(many=True, read_only=True)

    class Meta:
        model = RecognitionOfPriorLearning
        fields = [
            'id', 'course_workload', 'course_studied_workload', 'test_score', 'notice', 'discipline',
            'discipline_name', 'create_date', 'status_display', 'attachments', 'student_id', 'student', 'student',
            'student_name', 'student_email', 'student_matricula', 'student_course', 'steps'
        ]

    def get_student_name(self, obj):
        return obj.student.name if obj.student else None

    def get_student_email(self, obj):
        return obj.student.email if obj.student else None

    def get_status_display(self, obj):
        latest_step = Step.objects.filter(recognition_form=obj).order_by('-initial_step_date').first()
        if latest_step:
            return latest_step.get_status_display()
        return "Status não disponível"

    def create(self, validated_data):
        attachments_files = self.context['request'].FILES.getlist('attachment')
        student_id = validated_data.pop('student_id')
        student = get_object_or_404(Student, id=student_id)
        requisition = RecognitionOfPriorLearning.objects.create(student=student, **validated_data)

        Step.objects.create(
            recognition_form=requisition,
            status=RequestStatus.IN_ANALYSIS_BY_CRE,
            # responsible_id=responsible_id,
            initial_step_date=timezone.now(),
            current=True
        )

        for attachment_file in attachments_files:
            Attachment.objects.create(
                file_name=attachment_file.name,
                file_data=attachment_file.read(),
                content_type=attachment_file.content_type,
                recognition_form=requisition
            )

        return requisition


class KnowledgeCertificationSerializer(serializers.ModelSerializer):
    status_display = serializers.SerializerMethodField(read_only=True)
    discipline_name = serializers.CharField(source='discipline.name', read_only=True)
    student_id = serializers.IntegerField(write_only=True)
    student = serializers.PrimaryKeyRelatedField(read_only=True)
    student_name = serializers.SerializerMethodField()
    student_email = serializers.SerializerMethodField()
    student_matricula = serializers.CharField(source='student.matricula', read_only=True)
    student_course = serializers.CharField(source='student.course', read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)
    steps = StepSerializer(many=True, read_only=True)

    class Meta:
        model = KnowledgeCertification
        fields = [
            'id', 'previous_knowledge', 'scheduling_date', 'test_score', 'notice', 'discipline',
            'discipline_name', 'create_date', 'status_display', 'attachments', 'student_id', 'student',
            'student_name', 'student_email', 'student_matricula', 'student_course', 'steps'
        ]

    def get_student_name(self, obj):
        return obj.student.name if obj.student else None

    def get_student_email(self, obj):
        return obj.student.email if obj.student else None

    def get_status_display(self, obj):
        latest_step = Step.objects.filter(certification_form=obj).order_by('-initial_step_date').first()
        if latest_step:
            return latest_step.get_status_display()
        return "Status não disponível"

    def create(self, validated_data):
        attachments_files = self.context['request'].FILES.getlist('attachment')
        student_id = validated_data.pop('student_id')
        student = get_object_or_404(Student, id=student_id)
        certification = KnowledgeCertification.objects.create(student=student, **validated_data)

        Step.objects.create(
            certification_form=certification,
            status=RequestStatus.IN_ANALYSIS_BY_CRE,
            # responsible_id=responsible_id,
            initial_step_date=timezone.now(),
            current=True
        )

        for attachment_file in attachments_files:
            Attachment.objects.create(
                file_name=attachment_file.name,
                file_data=attachment_file.read(),
                content_type=attachment_file.content_type,
                certification_form=certification
            )

        return certification
