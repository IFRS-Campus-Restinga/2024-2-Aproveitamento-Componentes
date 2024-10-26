from django.contrib.auth.models import User
from users.models import Student, Servant
from users.enum.servant_type_enum import ServantTypeEnum
superuser = User.objects.create_superuser("admin", "admin@admin.com", "123")

student1 = User.objects.create_user(username='murilo@hotmail.com', first_name='murilo', email='murilo@hotmail.com', password=None)
Student.objects.create(
    user= student1,
    name='murilo',
    email='murilo@hotmail.com',
    matricula="1994000401",
    course="ADS"
)
stundent2 = User.objects.create_user(username='eduador@hotmail.com', first_name='eduador', email='eduador@hotmail.com', password=None)
Student.objects.create(
    user= stundent2,
    name='eduardo',
    email='eduardo@hotmail.com',
    matricula="3212313",
    course="ADS"
)

teacher = User.objects.create_user(username='ricardo@hotmail.com', first_name='ricardo', email='ricardo@hotmail.com', password=None)
Servant.objects.create(
    user= teacher,
    name='ricardo',
    email='ricardo@hotmail.com',
    siape="123123"
)
coordenador = User.objects.create_user(username='roben@hotmail.com', first_name='roben', email='roben@hotmail.com', password=None)
Servant.objects.create(
    user= coordenador,
    name='roben',
    email='roben@hotmail.com',
    siape="3213234455",
    servant_type=ServantTypeEnum.COORDINATOR.value
)

cre = User.objects.create_user(username='servidor@hotmail.com', first_name='servidor', email='servidor@hotmail.com', password=None)
Servant.objects.create(
    user= cre,
    name='servidor',
    email='servidor@hotmail.com',
    siape="2121212",
    servant_type=ServantTypeEnum.ENSINO.value,
    is_active=False
)