from django.contrib.auth.models import User

superuser = User.objects.create_superuser("admin", "admin@admin.com", "123")