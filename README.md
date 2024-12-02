# 2024-2-Aproveitamento-Componentes

frontend
node 18 >
```sh
npm i
npm run dev
```

backend
```sh
pip install -r requirements.txt
coloque o arquivo env_settings.py em Dev2/api
py manage.py makemigrations courses
py manage.py makemigrations notices
py manage.py makemigrations forms
py manage.py makemigrations disciplines
py manage.py makemigrations users
py manage.py migrate
py manage.py shell < script.py
py manage.py runserver
```