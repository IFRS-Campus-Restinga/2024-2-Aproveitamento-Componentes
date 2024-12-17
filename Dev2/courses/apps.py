from django.apps import AppConfig


class CoursesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'courses'

class PedagogicalPlansConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'pedagogical_plans'
