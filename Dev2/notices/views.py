from rest_framework import generics, status
from rest_framework.response import Response

from .models import Notice
from .serializers import NoticeSerializer


class NoticeListCreateView(generics.ListCreateAPIView):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer


class NoticeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        print("Método DELETE foi chamado, mas não permitido.")
        return Response({"detail": "Método DELETE não permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
