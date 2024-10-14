from rest_framework.views import APIView
from app.utils.custom_exception_handler import custom_exception_handler

class CustomAPIView(APIView):
    def handle_exception(self, exc):
        response = custom_exception_handler(exc, self)
        return super().handle_exception(exc) if response is None else response