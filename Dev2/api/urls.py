from django.contrib import admin
from django.urls import path, include

from .views import GoogleAuthView, GoogleAuthCallbackView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth-google', GoogleAuthView.as_view(), name='auth_google'),
    path('oauth2callback', GoogleAuthCallbackView.as_view(), name='google_callback'),
    path('users/', include('users.urls')),
    path('forms/', include('forms.urls')),
    path('notices/', include('notices.urls'))
]
