from django.urls import path
from .views.user_list_view import ListUsersAPIView
from .views.user import CreateUserView, AlterActiveByEmailView,RetrieveUserByIdAPIView
from .views.user import CreateUserView, UpdateActiveByIdView, UpdateUserByIdView
from .views.user_details import UserDetails

urlpatterns = [
    path('list/', ListUsersAPIView.as_view(), name='list_users'),
    path('create/', CreateUserView.as_view(), name='create_user'),
    path('update-activity/<int:id>/', UpdateActiveByIdView.as_view(), name='update_active_user'),
    path('update/<int:id>/', UpdateUserByIdView.as_view(), name='update_user'),
    path('details/', UserDetails.as_view(), name='user-details'),
    path('read/<int:user_id>/', RetrieveUserByIdAPIView.as_view(), name='read_user_by_id'),
]