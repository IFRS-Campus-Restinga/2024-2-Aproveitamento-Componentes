from xml.etree.ElementInclude import include

from django.contrib import admin
from django.urls import re_path, path

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^users/', include('users.urls'))
]
