from django.contrib import admin

from notices.models import Notice
from .models import AbstractUser, Servant, Student
from forms.models import RecognitionOfPriorLearning, KnowledgeCertification, Attachment

# Register your models here.
admin.site.register((
   Student,
   Servant,
   Notice,
   RecognitionOfPriorLearning,
   KnowledgeCertification,
   Attachment
))