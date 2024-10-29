const disciplines = [
  {
    Name: "Testes",
  },
  {
    Name: "Dev2",
  },
  {
    Name: "Segurança",
  },
];
const requests = [
  {
    Course: "Ads",
    Name: "Eduardo",
    Type: "Certificação de Conhecimento",
    Status: "Indeferido",
  },
  {
    Course: "Letras",
    Name: "Bob",
    Type: "Aproveitamento de Estudos",
    Status: "Deferido",
  },
];

const courses = {
  Ads: "Análise e Desenvolvimento de Sistemas",
  Letras: "Letras",
  Eletronica: "Eletrônica",
  Historia: "História",
};

const admissions = [
  "2016/1",
  "2016/2",
  "2017/1",
  "2017/2",
  "2018/1",
  "2018/2",
  "2019/1",
  "2019/2",
  "2020/1",
  "2020/2",
  "2021/1",
  "2021/2",
  "2022/1",
  "2022/2",
];

const roles = {
  Professor: "Professor",
  Coordenator: "Coordenador",
  Cre: "Ensino",
  Admin: "Administrador",
  Student: "Estudante",
};

const users = [
  {
    Id: 0,
    Name: "Aluna Jessica",
    Email: "2020010599@restinga.ifrs.edu.br",
    Course: courses.Ads,
    Enrollment: "2020010599",
    Ciape: null,
    Admission: "2020/2",
    Role: "Estudante",
    isActive: true,
  },
  {
    Id: 1,
    Name: "Aluno Silva",
    Email: "2020010555@restinga.ifrs.edu.br",
    Course: courses.Ads,
    Enrollment: "2020010555",
    Ciape: null,
    Admission: "2020/2",
    Role: "Estudante",
    isActive: false,
  },
  {
    Id: 2,
    Name: "Aluno Torres",
    Email: "2022000999@restinga.ifrs.edu.br",
    Course: courses.Letras,
    Enrollment: "2022000999",
    Ciape: null,
    Admission: "2022/1",
    Role: "Estudante",
    isActive: false,
  },
  {
    Id: 3,
    Name: "Prof Simões",
    Email: "simoes@restinga.ifrs.edu.br",
    Course: null,
    Enrollment: null,
    Ciape: "12345678",
    Admission: "2022/2",
    Role: "Professor",
    isActive: false,
  },
  {
    Id: 4,
    Name: "Prof Tadeu",
    Email: "tadeu@restinga.ifrs.edu.br",
    Course: null,
    Enrollment: null,
    Ciape: "87654321",
    Admission: "2016/1",
    Role: "Professor",
    isActive: true,
  },
  {
    Id: 5,
    Name: "Prof Ana",
    Email: "ana@restinga.ifrs.edu.br",
    Course: null,
    Enrollment: null,
    Ciape: "14523698",
    Admission: "2018/1",
    Role: "Coordenador",
    isActive: true,
  },
  {
    Id: 6,
    Name: "Joao Feijao",
    Email: "joao@restinga.ifrs.edu.br",
    Course: null,
    Enrollment: null,
    Ciape: "36521478",
    Admission: "2020/1",
    Role: "Servidor",
    isActive: true,
  },
];

export { users, courses, admissions, roles, requests, disciplines };