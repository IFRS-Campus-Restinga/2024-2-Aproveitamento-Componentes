from django.urls import path
from .views.user_list_view import ListUsersAPIView, ListUserAPIView
from .views.user import CreateUserView, AlterActiveByEmailView,RetrieveUserByIdAPIView
from .views.user_details import UserDetails

urlpatterns = [
    path('list/', ListUsersAPIView.as_view(), name='list_users'),
    path('lists/', ListUserAPIView.as_view(), name='lists_users'),
    path('create/', CreateUserView.as_view(), name='create_user'),
    path('alter-activity/<str:email>/', AlterActiveByEmailView.as_view(), name='create_user'),
    path('details/', UserDetails.as_view(), name='user-details'),
    path('read/<int:user_id>/', RetrieveUserByIdAPIView.as_view(), name='read_user_by_id'),
]