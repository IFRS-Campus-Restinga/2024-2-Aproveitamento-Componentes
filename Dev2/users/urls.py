from django.urls import path

from .views.course_view import ListCoursesAPIView
from .views.user_list_view import ListUsersAPIView

urlpatterns = [
    path('list/', ListUsersAPIView.as_view(), name='list_users'),
    path('listCourse/', ListCoursesAPIView.as_view(), name='list_courses'),
]