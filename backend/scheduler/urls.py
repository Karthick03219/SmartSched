from django.urls import path

from .views import (
    health_check,
    dashboard_stats,
    generate_timetable,
    timetable_list,
)


urlpatterns = [
    path("health/", health_check, name="health"),
    path("dashboard/", dashboard_stats, name="dashboard"),
    path(
        "timetable/generate/",
        generate_timetable,
        name="generate-timetable",
    ),
    path(
        "timetable/",
        timetable_list,
        name="timetable-list",
    ),
]