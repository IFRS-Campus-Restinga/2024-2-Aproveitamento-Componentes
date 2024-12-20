# 2024-2-Aproveitamento-Componentes

frontend
node 18 >
```sh
npm i
npm install jspdf
npm run dev
```

backend
```sh
# pip3 install WeasyPrint #rodei com pip também,pois o pip3 instala no Python 3 ou no seu virtualenv
# pip3 install reportlab #rodei com pip install reportlab também,pois o pip3 instala no Python 3 ou no seu virtualenv
pip install python-decouple
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