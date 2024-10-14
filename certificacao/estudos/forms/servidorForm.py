from django import forms
from estudos.models import Servidor

class ServidorForm(forms.ModelForm):
    class Meta:
        model = Servidor
        fields = '__all__'
        exclude = []