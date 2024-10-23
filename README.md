# 2024-2-Aproveitamento-Componentes

frontend
node 18 >
```sh
npm i
npm run dev
```

backend
```sh
descomentar | from .env_settings import * | em settings
pip install -r requirements.txt
py manage.py makemigrations
Se a pasta migrations não foi criada em users, usar > py manage.py makemigrations users
py manage.py migrate
py manage.py shell < script.py
```
```sh
py manage.py runserver
```