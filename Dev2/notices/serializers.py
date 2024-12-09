import json

from rest_framework import serializers
from .models import Notice

class NoticeSerializer(serializers.ModelSerializer):
    extra_fields = serializers.JSONField(required=False)
    rectifications = serializers.ListField(
        child=serializers.URLField(), required=False, allow_empty=True
    )

    class Meta:
        model = Notice
        fields = [
            'id', 'number', 'publication_date',
            'documentation_submission_start', 'documentation_submission_end',
            'proposal_analysis_start', 'proposal_analysis_end',
            'result_publication', 'result_homologation',
            'link', 'rectifications', 'extra_fields'
        ]
        
    def validate(self, data):
        # Verifica se todas as datas existem para validação
        publication_date = data.get('publication_date')
        doc_start = data.get('documentation_submission_start')
        doc_end = data.get('documentation_submission_end')
        analysis_start = data.get('proposal_analysis_start')
        analysis_end = data.get('proposal_analysis_end')
        result_homologation = data.get('result_homologation')
        result_publication = data.get('result_publication')
        
        # 1. Validação: `number` deve ser coerente com `publication_date`
        number = data.get('number')
        if number and publication_date:
            try:
                semester, year = map(int, number.split('-'))
                if semester not in [1, 2] or year != publication_date.year:
                    raise serializers.ValidationError(
                        "O número do edital deve ser coerente com o semestre e ano da data de publicação."
                    )
            except ValueError:
                raise serializers.ValidationError(
                    "O número do edital deve estar no formato correto: <semestre>/<ano> (exemplo: 1/2024)."
                )

        # 2. Validação: Todas as datas devem ser depois de `publication_date`
        date_fields = {
            "Início da submissão de documentação": doc_start,
            "Fim da submissão de documentação": doc_end,
            "Início da análise de propostas": analysis_start,
            "Fim da análise de propostas": analysis_end,
            "Homologação do resultado": result_homologation,
            "Publicação do resultado": result_publication,
        }
        for field_name, field_date in date_fields.items():
            if field_date and publication_date and field_date < publication_date:
                raise serializers.ValidationError(
                    f"{field_name} deve ser posterior à data de publicação do edital."
                )

        # 3. Validação: `documentation_submission_start` <= `documentation_submission_end`
        if doc_start and doc_end and doc_end < doc_start:
            raise serializers.ValidationError(
                "O prazo final para submissão de documentação deve ser posterior ou igual ao início."
            )

        # 4. Validação: `proposal_analysis_start` começa depois de `documentation_submission_end`
        if doc_end and analysis_start and analysis_start < doc_end:
            raise serializers.ValidationError(
                "O início da análise de propostas deve ser posterior ao fim da submissão de documentação."
            )

        # 4.1. Validação: `proposal_analysis_start` <= `proposal_analysis_end`
        if analysis_start and analysis_end and analysis_end < analysis_start:
            raise serializers.ValidationError(
                "O fim da análise de propostas deve ser posterior ou igual ao início."
            )

        # 5. Validação: `result_homologation` começa depois de `proposal_analysis_end`
        if analysis_end and result_homologation and result_homologation < analysis_end:
            raise serializers.ValidationError(
                "A homologação do resultado deve ser posterior ao fim da análise de propostas."
            )

        # 6. Validação: `result_publication` começa depois de `result_homologation`
        if result_homologation and result_publication and result_publication < result_homologation:
            raise serializers.ValidationError(
                "A publicação do resultado deve ser posterior à homologação do resultado."
            )

        return data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['extra_fields'] = instance.get_extra_fields()
        return representation

    def to_internal_value(self, data):
        if 'extra_fields' in data:
            data['extra_fields'] = json.dumps(data['extra_fields'])
        return super().to_internal_value(data)
