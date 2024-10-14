from django.urls import path

from views import user_list_view, GoogleAuthCallbackView, GoogleAuthView, DetalhesUsuario

urlpatterns = [
    path('api/auth/auth-google', GoogleAuthView.as_view(), name='auth_google'),
    path('api/auth/oauth2callback', GoogleAuthCallbackView.as_view(), name='google_callback'),
    path('api/users/', user_list_view.list_users, name='list_users'),
    path('api/users/details', DetalhesUsuario.as_view(), name='detalhes-usuario'),
    path('api/users/students/', user_list_view.list_students, name='list_students'),
    path('api/users/servants/', user_list_view.list_servants, name='list_servants')
]
