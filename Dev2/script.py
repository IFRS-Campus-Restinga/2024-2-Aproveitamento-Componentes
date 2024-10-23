from django.contrib.auth.models import User
from users.models import Student
superuser = User.objects.create_superuser("admin", "admin@admin.com", "123")

student1 = User.objects.create_user(username='murilo', email='murilo@hotmail.com', password=None)
murilo = Student.objects.create(
    user= student1,
    nome='murilo',
    email='murilo@hotmail.com'
)
stundent2 = User.objects.create_user(username='eduador', email='eduador@hotmail.com', password=None)
eduador = Student.objects.create(
    user= stundent2,
    nome='eduardo',
    email='eduardo@hotmail.com'
)