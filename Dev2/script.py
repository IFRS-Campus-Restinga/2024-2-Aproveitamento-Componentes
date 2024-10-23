from django.contrib.auth.models import User
from users.models import Student
superuser = User.objects.create_superuser("admin", "admin@admin.com", "123")

student1 = User.objects.create_user(username='murilo@hotmail.com', first_name='murilo', email='murilo@hotmail.com', password=None)
murilo = Student.objects.create(
    user= student1,
    name='murilo',
    email='murilo@hotmail.com',
    matricula="1994000401",
    course="ADS"
)
stundent2 = User.objects.create_user(username='eduador@hotmail.com', first_name='eduador', email='eduador@hotmail.com', password=None)
eduador = Student.objects.create(
    user= stundent2,
    name='eduardo',
    email='eduardo@hotmail.com',
    matricula="3212313",
    course="ADS"
)