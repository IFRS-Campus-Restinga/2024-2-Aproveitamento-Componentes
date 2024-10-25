from django.urls import path

from forms.views import *

urlpatterns = [
    path('steps/', StepListCreateView.as_view(), name='steps-list-create'),
    path('requisition-forms/', RequisitionFormListCreateView.as_view(), name='requisition-forms-list-create'),
    path('requisition-forms/<uuid:id>/', RequisitionFormDetailView.as_view(), name='requisition-form-detail'),
]