from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q
from rest_framework.filters import SearchFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from ..models import PedagogicalPlanCourse
from ..serializers import PedagogicalPlanCourseSerializer

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        return request.user.is_staff

class PedagogicalPlanCourseListCreateView(ListCreateAPIView):
    queryset = PedagogicalPlanCourse.objects.all()
    serializer_class = PedagogicalPlanCourseSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [SearchFilter]
    search_fields = ["name", "course__name", "disciplines__name"]

    def get_queryset(self):
        # Filtro por data de vigência (start_duration <= hoje <= end_duration)
        active = self.request.query_params.get("active", None)
        queryset = super().get_queryset()
        if active == "true":
            queryset = queryset.filter(start_duration__lte=timezone.now(), end_duration__gte=timezone.now())
        return queryset

class PedagogicalPlanCourseRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = PedagogicalPlanCourse.objects.all()
    serializer_class = PedagogicalPlanCourseSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
