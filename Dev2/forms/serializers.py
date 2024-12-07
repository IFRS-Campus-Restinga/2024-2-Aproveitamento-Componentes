from datetime import datetime, timedelta
from decimal import Decimal

import pytz
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers

from courses.models import Course
from notices.models import Notice
from users.models import Servant, AbstractUser
from users.models import Student
from users.serializers import ServantSerializer
from .models import Step, Attachment, RecognitionOfPriorLearning, KnowledgeCertification, \
    RequestStatus, FAILED_STATUS, ANALYSIS_STATUS, STUDENT_STATUS, CRE_STATUS, COORD_STATUS, PROF_STATUS


class StepSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    responsible = ServantSerializer(read_only=True)
    responsible_id = serializers.PrimaryKeyRelatedField(queryset=Servant.objects.all(), required=False, write_only=True)

    class Meta:
        model = Step
        fields = [
            'id', 'status', 'status_display', 'feedback', 'initial_step_date', 'final_step_date',
            'current', 'recognition_form', 'certification_form', 'responsible', 'responsible_id'
        ]

    def validate(self, data):
        # Verifica se alguma requisição foi passada para a criação do Step
        recognition_form = data.get('recognition_form')
        certification_form = data.get('certification_form')
        if (recognition_form and certification_form) or (not recognition_form and not certification_form):
            raise serializers.ValidationError(
                "Deve ser fornecida uma requisição"
            )
        form = recognition_form if recognition_form else certification_form

        # Localiza o step anterior se existir
        latest_step = None
        if recognition_form:
            latest_step = Step.objects.filter(recognition_form=recognition_form).order_by('-initial_step_date').first()
        elif certification_form:
            latest_step = Step.objects.filter(certification_form=certification_form).order_by(
                '-initial_step_date').first()

        # Verifica se foi informado um status
        status = data.get('status')
        if not status:
            raise serializers.ValidationError("Status é obrigatório para a criação")

        # Verifica o status do último step
        current_status = None
        if latest_step:
            current_status = latest_step.status

        # Identifica quem fez a requisição, sua role e o torna responsável pelo step
        user = self.context.get('user')
        abstract_user = AbstractUser.objects.filter(user_id=user.id).first()
        user_role = abstract_user.type.value

        # Valida o tipo do usuário
        if not user_role:
            raise serializers.ValidationError("Erro ao identificar o tipo de usuário")

        # Valida se o usuário que fez a requisição existe no sistema
        if not user:
            raise serializers.ValidationError("Usuário não autenticado")

        # O coordenador informa o professor que deve ficar responsável pelo Status
        if status == RequestStatus.IN_ANALYSIS_BY_PROFESSOR:
            responsible = data.get('responsible_id')
            data['responsible_id'] = responsible.id

        # Verifica quem é o coordenador do curso da disciplina da solicitação e o atribui como responsável pelos steps da coordenação
        elif status == RequestStatus.IN_ANALYSIS_BY_COORDINATOR or status == RequestStatus.IN_APPROVAL_BY_COORDINATOR or status == RequestStatus.RETURNED_BY_CRE:
            discipline_id = form.discipline_id
            course = Course.objects.filter(disciplines__id=discipline_id).first()
            if course and course.coordinator_id:
                data['responsible_id'] = course.coordinator_id
            else:
                data['responsible_id'] = None

        # Caso o coordenador retorne o step, o professor que aprovou ficará como responsável
        elif status == RequestStatus.RETURNED_BY_COORDINATOR:
            responsible = form.steps.filter(status=RequestStatus.ANALYZED_BY_PROFESSOR).last().responsible
            data['responsible_id'] = responsible.id if responsible else None

        # Define como responsável pela homologação do ensino o mesmo servidor que analisou a solicitação
        elif status == RequestStatus.IN_APPROVAL_BY_CRE:
            responsible = form.steps.filter(status=RequestStatus.ANALYZED_BY_CRE).last().responsible
            data['responsible_id'] = responsible.id if responsible else None

        # Se cancelado pelo aluno não haverá servidor responsável
        elif status == RequestStatus.CANCELED:
            data['responsible_id'] = None

        # Sem condições especiais, quem fez a requisição ficará responsável pelo step
        else:
            data['responsible_id'] = abstract_user.id

        print("Cargo do usuário: " + user_role)

        # Valida se a solicitação foi finalizada, não podendo mais ser alterada
        if current_status in FAILED_STATUS or current_status == RequestStatus.APPROVED_BY_CRE:
            if status != current_status:
                raise serializers.ValidationError("Não é permitido alterar o status após finalização")

        # Verifica se o step criado possui um status que pode ser criado pelo aluno
        if user_role == 'Aluno':
            if status not in STUDENT_STATUS:
                raise serializers.ValidationError(f"Aluno não pode definir o status como '{status}'")

        # Verifica se o step criado possui um status que pode ser criado pelo ensino
        elif user_role == 'Ensino':
            if status not in CRE_STATUS:
                raise serializers.ValidationError(f"CRE não pode definir o status como '{status}'")

        # Verifica se o step criado possui um status que pode ser criado pelo coordenador
        elif user_role == 'Coordenador':
            if status not in COORD_STATUS:
                raise serializers.ValidationError(f"Coordenador não pode definir o status como '{status}'")

        # Verifica se o step criado possui um status que pode ser criado pelo professor
        elif user_role == 'Professor':
            if status not in PROF_STATUS:
                raise serializers.ValidationError(f"Professor não pode definir o status como '{status}'")

        # Verifica se o step possui um feedback caso precise
        if status not in [ANALYSIS_STATUS] and status != RequestStatus.CANCELED:
            if not data.get('feedback'):
                raise serializers.ValidationError("É necessário informar um feedback")

        # Se existe um step anterior, atribui uma data de finalização e define sua flag de 'atual' como false
        if latest_step:
            latest_step.final_step_date = timezone.now()
            latest_step.current = False
            latest_step.save()

        return data


class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ['id', 'file_name', 'content_type', 'certification_form', 'recognition_form', 'is_test_attachment']

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
            'id', 'course_workload', 'course_studied_workload', 'notice', 'discipline',
            'discipline_name', 'create_date', 'status_display', 'attachments', 'student_id', 'student', 'student',
            'student_name', 'student_email', 'student_matricula', 'student_course', 'steps'
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        user = self.context.get('user')
        self.abstract_user = AbstractUser.objects.filter(user_id=user.id).first()
        if self.abstract_user is None:
            raise serializers.ValidationError("Usuário inválido")

    def get_student_name(self, obj):
        return obj.student.name if obj.student else None

    def get_student_email(self, obj):
        return obj.student.email if obj.student else None

    def get_status_display(self, obj):
        latest_step = Step.objects.filter(recognition_form=obj).order_by('-initial_step_date').first()
        if latest_step:
            return latest_step.get_status_display()
        return "Status não disponível"

    # def validate(self, data):
    #     # Verifica se existe um Notice (edital) aberto
    #     current_date = timezone.now()
    #     notice = Notice.objects.filter(documentation_submission_start__lte=current_date,
    #     documentation_submission_end__gte=current_date).first()
    #
    #     if not notice:
    #         raise serializers.ValidationError("Não há edital aberto no momento.")
    #
    #     # Se o Notice existe, verifica se a data está dentro do período permitido
    #     if not (notice.documentation_submission_start <= current_date <= notice.documentation_submission_end):
    #         raise serializers.ValidationError(f"A solicitação está fora do período do edital. O prazo é de {notice.documentation_submission_start} a {notice.documentation_submission_end}.")
    #
    #     return data

    def validate_course_workload(self, value):
        if not isinstance(value, int):
            raise serializers.ValidationError("course_workload deve ser um número inteiro válido.")
        if self.instance and self.abstract_user.id != self.instance.student_id:
            raise serializers.ValidationError("Apenas o aluno que fez a requisição pode alterar esse campo")
        return value

    def validate_course_studied_workload(self, value):
        if not isinstance(value, int):
            raise serializers.ValidationError("course_studied_workload deve ser um número inteiro válido.")
        if self.instance and self.abstract_user.id != self.instance.student_id:
            raise serializers.ValidationError("Apenas o aluno que fez a requisição pode alterar esse campo")
        return value

    def validate_status(self, value):
        if value not in dict(RequestStatus.choices):
            raise serializers.ValidationError("Status inválido")
        return value

    def create(self, validated_data):
        # Verifica se existe um Notice (edital) aberto
        current_date = timezone.now()
        notice = Notice.objects.filter(documentation_submission_start__lte=current_date,
                                       documentation_submission_end__gte=current_date).first()

        if not notice:
            raise serializers.ValidationError("Não há edital aberto no momento.")

        # Se o Notice existe, verifica se a data está dentro do período permitido
        if not (notice.documentation_submission_start <= current_date <= notice.documentation_submission_end):
            raise serializers.ValidationError(
                f"A solicitação está fora do período do edital. O prazo é de {notice.documentation_submission_start} a {notice.documentation_submission_end}.")

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

    def update(self, instance, validated_data):
        if (self.abstract_user.type != "Ensino" and
                self.abstract_user.id != instance.student_id and
                not instance.steps.filter(responsible_id=self.abstract_user.id).exists()):
            raise serializers.ValidationError("Usuário não está relacionado com a solicitação")
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance


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
    test_attachment = serializers.FileField(required=False, read_only=False, allow_null=True)

    class Meta:
        model = KnowledgeCertification
        fields = [
            'id', 'previous_knowledge', 'scheduling_date', 'test_score', 'notice', 'discipline',
            'discipline_name', 'create_date', 'status_display', 'attachments', 'student_id', 'student',
            'student_name', 'student_email', 'student_matricula', 'student_course', 'steps', 'test_attachment'
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        user = self.context.get('user')
        self.abstract_user = AbstractUser.objects.filter(user_id=user.id).first()
        if self.abstract_user is None:
            raise serializers.ValidationError("Usuário inválido")

    def get_student_name(self, obj):
        return obj.student.name if obj.student else None

    def get_student_email(self, obj):
        return obj.student.email if obj.student else None

    def get_status_display(self, obj):
        latest_step = Step.objects.filter(certification_form=obj).order_by('-initial_step_date').first()
        if latest_step:
            return latest_step.get_status_display()
        return "Status não disponível"

    # def validate(self, data):
    #     # Verifica se existe um Notice (edital) aberto
    #     current_date = timezone.now()
    #     notice = Notice.objects.filter(documentation_submission_start__lte=current_date,
    #     documentation_submission_end__gte=current_date).first()
    #
    #     if not notice:
    #         raise serializers.ValidationError("Não há edital aberto no momento.")
    #
    #     # Se o Notice existe, verifica se a data está dentro do período permitido
    #     if not (notice.documentation_submission_start <= current_date <= notice.documentation_submission_end):
    #         raise serializers.ValidationError(f"A solicitação está fora do período do edital. O prazo é de {notice.documentation_submission_start} a {notice.documentation_submission_end}.")
    #
    #     return data

    def validate_status(self, value):
        if value not in dict(RequestStatus.choices):
            raise serializers.ValidationError("Status inválido")
        return value

    def validate_previous_knowledge(self, value):
        if self.abstract_user.id != self.instance.student_id:
            raise serializers.ValidationError("Apenas o aluno que fez a requisição pode alterar esse campo")
        return value

    def validate_scheduling_date(self, value):
        try:
            user_role = self.abstract_user.type.value
            if user_role != 'Professor':
                raise serializers.ValidationError("Apenas o professor pode agendar a prova")
            if isinstance(value, str):
                value = datetime.strptime(value, "%Y-%m-%dT%H:%M")
            sao_paulo_tz = pytz.timezone('America/Sao_Paulo')
            value = sao_paulo_tz.localize(value) if value.tzinfo is None else value.astimezone(sao_paulo_tz)
            now_plus_24_hours = datetime.now(sao_paulo_tz) + timedelta(hours=24)
            if value < now_plus_24_hours:
                raise serializers.ValidationError("A data e hora devem ser no mínimo 24 horas após o momento atual.")
        except ValueError:
            raise serializers.ValidationError("Formato de data e hora inválido")
        return value

    def validate_test_score(self, value):
        user_role = self.abstract_user.type.value
        if user_role != 'Professor':
            raise serializers.ValidationError("Apenas o professor pode alterar a nota")
        if not isinstance(value, Decimal):
            raise serializers.ValidationError("test_score deve ser um número válido.")
        if not (0 <= value <= 10):
            raise serializers.ValidationError("test_score deve estar entre 0 e 10.")
        return value

    def validate_test_attachment(self, value):
        instance = self.instance
        existing_test_attachment = instance.attachments.filter(is_test_attachment=True).first()

        if existing_test_attachment:
            existing_test_attachment.file_name = value.name
            existing_test_attachment.file_data = value.read()
            existing_test_attachment.content_type = value.content_type
            existing_test_attachment.save()
        else:
            Attachment.objects.create(
                file_name=value.name,
                file_data=value.read(),
                content_type=value.content_type,
                certification_form=instance,
                is_test_attachment=True
            )
        return value

    def create(self, validated_data):
        # Verifica se existe um Notice (edital) aberto
        current_date = timezone.now()
        notice = Notice.objects.filter(documentation_submission_start__lte=current_date,
                                       documentation_submission_end__gte=current_date).first()

        if not notice:
            raise serializers.ValidationError("Não há edital aberto no momento.")

        # Se o Notice existe, verifica se a data está dentro do período permitido
        if not (notice.documentation_submission_start <= current_date <= notice.documentation_submission_end):
            raise serializers.ValidationError(
                f"A solicitação está fora do período do edital. O prazo é de {notice.documentation_submission_start} a {notice.documentation_submission_end}.")

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

    def update(self, instance, validated_data):
        if (self.abstract_user.type != "Ensino" and
                self.abstract_user.id != instance.student_id and
                not instance.steps.filter(responsible_id=self.abstract_user.id).exists()):
            raise serializers.ValidationError("Usuário não está relacionado com a solicitação")
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance
