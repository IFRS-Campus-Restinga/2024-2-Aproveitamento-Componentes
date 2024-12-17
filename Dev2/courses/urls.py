from django.urls import path

from .views.course_view import (ListCoursesAPIView, CreateCourseAPIView,
                                RetrieveCourseByIdAPIView, UpdateCourseAPIView,
                                DeleteCourseAPIView, SearchCourseByNameAPIView, CourseProfessorsView)
from .views.plano_view import (plano_list_create, plano_detail)

urlpatterns = [
    path('list', ListCoursesAPIView.as_view(), name='list_courses'),
    path('create', CreateCourseAPIView.as_view(), name='create_course'),
    path('read/<uuid:course_id>/', RetrieveCourseByIdAPIView.as_view(), name='read_course_by_id'),
    path('update/<uuid:course_id>', UpdateCourseAPIView.as_view(), name='update_course'),
    path('delete/<uuid:course_id>', DeleteCourseAPIView.as_view(), name='delete_course'),
    path('search/', SearchCourseByNameAPIView.as_view(), name='search_course_by_name'),
    path('professors/<int:coordinator_id>', CourseProfessorsView.as_view(), name='professors'),
    path('plano', plano_list_create, name='plano_list_create'),
    path('plano/<int:id>/', plano_detail, name='plano_detail'),
]
