from django.db import models
from django.utils import timezone
import uuid
import json

class Notice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    number = models.CharField(max_length=50)
    publication_date = models.DateTimeField(default=timezone.now)
    documentation_submission_start = models.DateTimeField()
    documentation_submission_end = models.DateTimeField()
    proposal_analysis_start = models.DateTimeField()
    proposal_analysis_end = models.DateTimeField()
    result_publication_start = models.DateTimeField()
    result_publication_end = models.DateTimeField()
    result_homologation_start = models.DateTimeField()
    result_homologation_end = models.DateTimeField()
    link = models.URLField(max_length=200, blank=False, null=False)
    rectifications = models.JSONField(default=list, blank=True)
    extra_fields = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Notice {self.number}"

    def set_extra_fields(self, data):
        self.extra_fields = json.dumps(data)

    def get_extra_fields(self):
        if self.extra_fields:
            return json.loads(self.extra_fields)
        return {}
