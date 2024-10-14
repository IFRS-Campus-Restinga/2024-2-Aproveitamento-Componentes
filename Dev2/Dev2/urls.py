from django.contrib import admin
from django.urls import path, include
from Dev2.views import GoogleAuthView, GoogleAuthCallbackView

from consultas import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth-google', GoogleAuthView.as_view(), name='auth_google'),
    path('oauth2callback', GoogleAuthCallbackView.as_view(), name='google_callback'),
]

urlpatterns = [
    path('api/users/', views.list_users, name='list_users'),
    path('api/users/students/', views.list_students, name='list_students'),
    path('api/users/servants/', views.list_servants, name='list_servants')
]
