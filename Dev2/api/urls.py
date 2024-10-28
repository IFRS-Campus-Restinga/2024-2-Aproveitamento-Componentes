from django.contrib import admin
from django.urls import path, include

from .views import GoogleAuthView, GoogleAuthCallbackView, UserDetails

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth-google', GoogleAuthView.as_view(), name='auth_google'),
    path('oauth2callback', GoogleAuthCallbackView.as_view(), name='google_callback'),
    path('user-details', UserDetails.as_view(), name='user-details'),
    path('users/', include('users.urls'))
]
