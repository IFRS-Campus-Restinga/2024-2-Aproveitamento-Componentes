from django import forms
from .models import Disciplines

class DisciplinesForm(forms.ModelForm):
    class Meta:
        model = Disciplines
        fields = ['name', 'workload', 'syllabus', 'prerequisites', 'professors']