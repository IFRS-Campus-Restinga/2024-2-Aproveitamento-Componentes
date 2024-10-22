from django.contrib.auth.models import User
from users.models import Student
superuser = User.objects.create_superuser("admin", "admin@admin.com", "123")
Student.objects.create(
    user=User.objects.create_user(username='aa', email='bbbb@hotmail.com', password=None),
    nome='murilo',
    email='bbbb@hotmail.com'
)
Student.objects.create(
    user=User.objects.create_user(username='nnnn', email='nnnnn@hotmail.com', password=None),
    nome='eduardo',
    email='nnnn@hotmail.com'
)