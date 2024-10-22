import json
from base64 import b64encode

from django.contrib.auth.models import User
from django.shortcuts import redirect
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView

from api.services import GoogleAuthService
from users.models import Student
from .. import settings


class GoogleAuthView(APIView):
    googleAuthService = GoogleAuthService()

    def get(self, request):
        try:
            return self.googleAuthService.request_authorization(request)
        except Exception:
            return redirect(settings.AUTH_ERROR_FRONTEND_URL)


class GoogleAuthCallbackView(APIView):
    googleAuthService = GoogleAuthService()

    def get(self, request):
        try:
            user_info = self.googleAuthService.request_callback(request)
            user = User.objects.filter(username=user_info['id']).first()
            encoded_data = b64encode(json.dumps(user_info).encode()).decode('utf-8')

            if user is None:
                estu = Estudante.objects.create(
                    user=User.objects.create_user(username=user_info['id'], email=user_info['email'], password=None),
                    nome=user_info['name'],
                    email=user_info['email']
                )
                print(estu)
                user = User.objects.create_user(username=user_info['id'], email=user_info['email'], password=None)
                user.save()

            token, created = Token.objects.get_or_create(user=user)

            return redirect(settings.AUTH_FRONTEND_URL.format(token=token.key, data=str(encoded_data)))
        except Exception:
            return redirect(settings.AUTH_ERROR_FRONTEND_URL)
