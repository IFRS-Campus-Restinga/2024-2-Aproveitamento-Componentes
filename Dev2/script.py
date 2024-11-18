from django.contrib.auth.models import User

from courses.models import Course
from notices.models import Notice
from users.models import Student, Servant
from disciplines.models import Disciplines
from users.enum.servant_type_enum import ServantTypeEnum
superuser = User.objects.create_superuser("admin", "admin@admin.com", "123")

student1 = User.objects.create_user(username='murilo@hotmail.com', first_name='murilo', email='murilo@hotmail.com',
                                    password=None)
Student.objects.create(
    user=student1,
    name='murilo',
    email='murilo@hotmail.com',
    matricula="1994000401",
    course="ADS"
)
stundent2 = User.objects.create_user(username='eduador@hotmail.com', first_name='eduador', email='eduador@hotmail.com',
                                     password=None)
Student.objects.create(
    user=stundent2,
    name='eduardo',
    email='eduardo@hotmail.com',
    matricula="3212313",
    course="ADS",
    is_active=False
)
stundent3 = User.objects.create_user(username='aaa', first_name='bruno', email='bruno@hotmail.com', password=None)
Student.objects.create(
    user= stundent3,
    name='bruno',
    email='bruno@gmail.com',
    matricula="323123",
    course="ADS",
)

stundent4 = User.objects.create_user(username='bbb', first_name='fernando', email='fernando@hotmail.com', password=None)
Student.objects.create(
    user= stundent4,
    name='fernando',
    email='fernando@gmail.com',
    matricula="323123",
    course="ADS",
)

teacher = User.objects.create_user(username='ricardo@hotmail.com', first_name='ricardo', email='ricardo@hotmail.com',
                                   password=None)
servant = Servant.objects.create(
    user=teacher,
    name='ricardo',
    email='ricardo@hotmail.com',
    siape="123123",
    servant_type=ServantTypeEnum.TEACHER.value,
)
coordenador = User.objects.create_user(username='roben@hotmail.com', first_name='roben', email='roben@hotmail.com',
                                       password=None)
Servant.objects.create(
    user=coordenador,
    name='roben',
    email='roben@hotmail.com',
    siape="3213234455",
    servant_type=ServantTypeEnum.COORDINATOR.value,
    is_verified=True
)

cre = User.objects.create_user(username='servidor@hotmail.com', first_name='servidor', email='servidor@hotmail.com',
                               password=None)
Servant.objects.create(
    user= cre,
    name='ensino',
    email='servidor@hotmail.com',
    siape="2121212",
    servant_type=ServantTypeEnum.ENSINO.value,
    is_verified=True
)
cre2 = User.objects.create_user(username='103891655523380520625', first_name='servidor', email='aluno.ifrs.restinga@gmail.com', password=None)
Servant.objects.create(
    user= cre2,
    name='servidor teste',
    email='aluno.ifrs.restinga@gmail.com',
    siape="3231213",
    servant_type=ServantTypeEnum.ENSINO.value,
    is_verified=True
)
notice = Notice.objects.create(
    id="1f7755ade0b341299ee00c46a12dc467",
    number="001-2023",
    publication_date="2023-10-01T09:00:00Z",
    documentation_submission_start="2023-10-05T09:00:00Z",
    documentation_submission_end="2023-10-10T17:00:00Z",
    proposal_analysis_start="2023-10-11T09:00:00Z",
    proposal_analysis_end="2023-10-20T17:00:00Z",
    result_publication_start="2023-10-21T09:00:00Z",
    result_publication_end="2023-10-22T17:00:00Z",
    result_homologation_start="2023-10-23T09:00:00Z",
    result_homologation_end="2023-10-25T17:00:00Z"
)

discipline = Disciplines.objects.create(
    id="fc40c88d-65ae-41ca-bd19-89075f9b4ea3",
    name="test",
    workload=123,
    syllabus= "Desenvolvimento do sistema de aproveitamento",
    professors= "Eliana Ricardo"
)

discipline.professors.add(servant)


Disciplines.objects.create(
    name= "Dev3",
    workload= "66h",
    syllabus= "Desenvolvimento do sistema de aproveitamento",
    professors= "Eliana Ricardo",
)

Disciplines.objects.create(
    name= "Dev4",
    workload= "66h",
    syllabus= "Desenvolvimento do sistema de aproveitamento",
    professors= "Eliana Ricardo",
)


course1 = Course.objects.create(name="Ciencia da Computacao")
course1.professors.add(Servant.objects.get(name='ricardo'))
course1.disciplines.add(Disciplines.objects.filter(name="test").first())  # Usa o primeiro registro encontrado

course2 = Course.objects.create(name="Engenharia de Software")
course2.professors.add(Servant.objects.get(user__username='ricardo@hotmail.com'))
course2.disciplines.add(Disciplines.objects.filter(name="Dev3").first())  # Usa o primeiro registro encontrado

course3 = Course.objects.create(name="Sistemas de Informacao")
course3.professors.add(Servant.objects.get(user__email='roben@hotmail.com'))
course3.disciplines.add(Disciplines.objects.filter(name="Dev4").first())  # Usa o primeiro registro encontrado

print("Cursos criados com sucesso!")
