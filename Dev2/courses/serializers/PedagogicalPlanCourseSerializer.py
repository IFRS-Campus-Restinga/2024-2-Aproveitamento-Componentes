from rest_framework import serializers
from disciplines.serializers import DisciplineSerializer
from disciplines.models import Disciplines
from courses.models import Course
from courses.serializers import CourseSerializer
from ..models import PedagogicalPlanCourse

class PedagogicalPlanCourseSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), write_only=True)
    disciplines = DisciplineSerializer(read_only=True, many=True)
    discipline_ids = serializers.PrimaryKeyRelatedField(queryset=Disciplines.objects.all(), write_only=True, many=True)

    class Meta:
        model = PedagogicalPlanCourse
        fields = [
            "id",
            "name",
            "authorization",
            "year",
            "start_duration",
            "end_duration",
            "total_workload",
            "duration",
            "turn",
            "course",
            "course_id",
            "disciplines",
            "discipline_ids",
        ]

    def create(self, validated_data):
        course = validated_data.pop("course_id")
        disciplines = validated_data.pop("discipline_ids", [])
        plan = PedagogicalPlanCourse.objects.create(course=course, **validated_data)
        plan.disciplines.set(disciplines)
        return plan

    def update(self, instance, validated_data):
        if "course_id" in validated_data:
            instance.course = validated_data.pop("course_id")
        if "discipline_ids" in validated_data:
            disciplines = validated_data.pop("discipline_ids")
            instance.disciplines.set(disciplines)
        return super().update(instance, validated_data)
