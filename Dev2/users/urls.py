from django.urls import path
from .views.user_list_view import ListUsersAPIView

urlpatterns = [
    path('list/', ListUsersAPIView.as_view(), name='list_users'),
]