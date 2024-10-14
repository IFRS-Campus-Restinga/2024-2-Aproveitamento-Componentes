from django.contrib import admin
from django.urls import path, include
from Dev2.views import GoogleAuthView, GoogleAuthCallbackView, DetalhesUsuario
urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth-google', GoogleAuthView.as_view(), name='auth_google'),
    path('oauth2callback', GoogleAuthCallbackView.as_view(), name='google_callback'),
    path('detalhes-usuario', DetalhesUsuario.as_view(), name='detalhes-usuario'),
]
