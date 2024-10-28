from django.urls import path
from .views.user_list_view import ListUsersAPIView
from .views.user import CreateUserView

urlpatterns = [
    path('list/', ListUsersAPIView.as_view(), name='list_users'),
    path('create/', CreateUserView.as_view(), name='create_user'),
    
]