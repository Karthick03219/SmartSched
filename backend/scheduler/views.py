from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import (
    Division,
    Faculty,
    Room,
    Subject,
    TeachingAssignment,
    Period,
    TimetableEntry,
)

from .services import TimetableGenerator, TimetableGenerationError


@api_view(["GET"])
def health_check(request):
    return Response({
        "success": True,
        "message": "SmartSched API is running"
    })


@api_view(["GET"])
def dashboard_stats(request):
    return Response({
        "success": True,
        "data": {
            "divisions": Division.objects.count(),
            "faculty": Faculty.objects.count(),
            "rooms": Room.objects.count(),
            "subjects": Subject.objects.count(),
            "periods": Period.objects.count(),
            "teaching_assignments": TeachingAssignment.objects.count(),
            "timetable_entries": TimetableEntry.objects.count(),
        }
    })


@api_view(["POST"])
def generate_timetable(request):
    """
    Generate a complete timetable using the constraint engine.
    """

    assignments = TeachingAssignment.objects.select_related(
        "division",
        "subject",
        "faculty",
    ).all()

    periods = Period.objects.all()

    rooms = Room.objects.all()

    generator = TimetableGenerator(
        assignments=assignments,
        periods=periods,
        rooms=rooms,
    )

    try:
        generated_schedule = generator.generate()

    except TimetableGenerationError as error:
        return Response(
            {
                "success": False,
                "message": error.message,
                "conflicts": error.conflicts,
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    # Remove the previous generated timetable.
    TimetableEntry.objects.all().delete()

    entries = []

    for item in generated_schedule:
        timetable_entry = TimetableEntry.objects.create(
            teaching_assignment=item["teaching_assignment"],
            period=item["period"],
            room=item["room"],
        )

        entries.append(
            serialize_timetable_entry(timetable_entry)
        )

    return Response(
        {
            "success": True,
            "message": "Timetable generated successfully.",
            "total_entries": len(entries),
            "entries": entries,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
def timetable_list(request):
    """
    Return the currently generated timetable.
    """

    timetable_entries = TimetableEntry.objects.select_related(
        "teaching_assignment__division",
        "teaching_assignment__subject",
        "teaching_assignment__faculty",
        "room",
        "period",
    ).order_by(
        "period__day",
        "period__period_number",
    )

    entries = [
        serialize_timetable_entry(entry)
        for entry in timetable_entries
    ]

    return Response(
        {
            "success": True,
            "total_entries": len(entries),
            "entries": entries,
        }
    )


def serialize_timetable_entry(entry):
    """
    Convert a timetable entry into JSON-friendly data.
    """

    assignment = entry.teaching_assignment

    return {
        "id": entry.id,

        "division": {
            "id": assignment.division.id,
            "name": assignment.division.name,
            "student_count": assignment.division.student_count,
        },

        "subject": {
            "id": assignment.subject.id,
            "code": assignment.subject.code,
            "name": assignment.subject.name,
            "type": assignment.subject.subject_type,
        },

        "faculty": {
            "id": assignment.faculty.id,
            "name": assignment.faculty.name,
            "department": assignment.faculty.department,
        },

        "room": {
            "id": entry.room.id,
            "name": entry.room.name,
            "capacity": entry.room.capacity,
            "type": entry.room.room_type,
        },

        "period": {
            "id": entry.period.id,
            "day": entry.period.day,
            "day_name": entry.period.get_day_display(),
            "period_number": entry.period.period_number,
            "start_time": entry.period.start_time.strftime("%H:%M"),
            "end_time": entry.period.end_time.strftime("%H:%M"),
        },
    }