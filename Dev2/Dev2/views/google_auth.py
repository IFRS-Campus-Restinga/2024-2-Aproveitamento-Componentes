from rest_framework.views import APIView
from Dev2.services import GoogleAuthService
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.shortcuts import redirect
from .. import settings
from base64 import b64encode
import json 
from Dev2.models import Estudante

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
                    user = User.objects.create_user(username=user_info['id'], email=user_info['email'], password=None),
                    nome = user_info['name'],
                    email = user_info['email']
                )
                print(estu)
                user = User.objects.create_user(username=user_info['id'], email=user_info['email'], password=None)
                user.save()

            token, created = Token.objects.get_or_create(user=user)

            return redirect(settings.AUTH_FRONTEND_URL.format(token = token.key, data = str(encoded_data)))
        except Exception:
            return redirect(settings.AUTH_ERROR_FRONTEND_URL)