from django.urls import path

from .views.course_view import (ListCoursesAPIView, CreateCourseAPIView,
                                RetrieveCourseAPIView, UpdateCourseAPIView,
                                DeleteCourseAPIView)

urlpatterns = [
    path('list', ListCoursesAPIView.as_view(), name='list_courses'),
    path('create', CreateCourseAPIView.as_view(), name='create_course'),
    path('read/<int:course_id>', RetrieveCourseAPIView.as_view(), name='read_course'),
    path('update/<int:course_id>', UpdateCourseAPIView.as_view(), name='update_course'),
    path('delete/<int:course_id>', DeleteCourseAPIView.as_view(), name='delete_course'),
]