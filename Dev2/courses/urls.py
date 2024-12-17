from django.urls import path

from .views.course_view import (ListCoursesAPIView, CreateCourseAPIView,
                                RetrieveCourseByIdAPIView, UpdateCourseAPIView,
                                DeleteCourseAPIView, SearchCourseByNameAPIView, CourseProfessorsView)

from .views.pedagogical_plan_view import (CreatePedagogicalPlanAPIView, ListPedagogicalPlansAPIView, UpdatePedagogicalPlanAPIView, DeletePedagogicalPlanAPIView)

urlpatterns = [
    path('list', ListCoursesAPIView.as_view(), name='list_courses'),
    path('create', CreateCourseAPIView.as_view(), name='create_course'),
    path('read/<uuid:course_id>/', RetrieveCourseByIdAPIView.as_view(), name='read_course_by_id'),
    path('update/<uuid:course_id>', UpdateCourseAPIView.as_view(), name='update_course'),
    path('delete/<uuid:course_id>', DeleteCourseAPIView.as_view(), name='delete_course'),
    path('search/', SearchCourseByNameAPIView.as_view(), name='search_course_by_name'),
    path('professors/<int:coordinator_id>', CourseProfessorsView.as_view(), name='professors'),
    path('list', ListPedagogicalPlansAPIView.as_view(), name='list_pedagogical_plan'),
    path('create', CreatePedagogicalPlanAPIView.as_view(), name='pedagogical_plan_create'),
    path('update/<uuid:course_id>', UpdatePedagogicalPlanAPIView.as_view(), name='update_pedagogical_plan'),
    path('delete/<uuid:course_id>', DeletePedagogicalPlanAPIView.as_view(), name='delete_pedagogical_plan'),
]
