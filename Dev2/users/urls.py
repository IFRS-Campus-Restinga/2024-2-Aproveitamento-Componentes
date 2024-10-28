from django.urls import path

from .views.course_view import (ListCoursesAPIView, CreateCourseAPIView,
                                RetrieveCourseAPIView, UpdateCourseAPIView,
                                DeleteCourseAPIView)
from .views.user_list_view import ListUsersAPIView

urlpatterns = [
    path('list/', ListUsersAPIView.as_view(), name='list_users'),
    path('course/list', ListCoursesAPIView.as_view(), name='list_courses'),
    path('course/create', CreateCourseAPIView.as_view(), name='create_course'),
    path('course/read/<int:course_id>', RetrieveCourseAPIView.as_view(), name='read_course'),
    path('course/update/<int:course_id>/', UpdateCourseAPIView.as_view(), name='update_course'),
    path('course/delete/<int:course_id>/', DeleteCourseAPIView.as_view(), name='delete_course'),
]