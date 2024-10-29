import json

from rest_framework import serializers
from .models import Notice

class NoticeSerializer(serializers.ModelSerializer):
    extra_fields = serializers.JSONField(required=False)  # Define como JSONField no serializer

    class Meta:
        model = Notice
        fields = [
            'id', 'number', 'publication_date',
            'documentation_submission_start', 'documentation_submission_end',
            'proposal_analysis_start', 'proposal_analysis_end',
            'result_publication_start', 'result_publication_end',
            'result_homologation_start', 'result_homologation_end',
            'extra_fields'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['extra_fields'] = instance.get_extra_fields()
        return representation

    def to_internal_value(self, data):
        if 'extra_fields' in data:
            data['extra_fields'] = json.dumps(data['extra_fields'])
        return super().to_internal_value(data)
