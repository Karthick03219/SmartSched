from datetime import time

from django.core.management.base import BaseCommand

from scheduler.models import (
    Division,
    Faculty,
    Room,
    Subject,
    TeachingAssignment,
    Period,
)


class Command(BaseCommand):

    help = "Create demo data for SmartSched"

    def handle(self, *args, **options):

        self.stdout.write(
            self.style.WARNING(
                "Creating SmartSched demo data..."
            )
        )

        # -------------------------------------------------
        # Clear existing data
        # -------------------------------------------------

        TeachingAssignment.objects.all().delete()
        Period.objects.all().delete()
        Subject.objects.all().delete()
        Faculty.objects.all().delete()
        Room.objects.all().delete()
        Division.objects.all().delete()

        # -------------------------------------------------
        # Divisions
        # -------------------------------------------------

        cse_a = Division.objects.create(
            name="CSE-A",
            student_count=55,
        )

        cse_b = Division.objects.create(
            name="CSE-B",
            student_count=48,
        )

        aiml_a = Division.objects.create(
            name="AI&ML-A",
            student_count=52,
        )

        # -------------------------------------------------
        # Faculty
        # -------------------------------------------------

        faculty_data = [
            ("Dr. Anitha", "Computer Science"),
            ("Prof. Ravi", "Computer Science"),
            ("Dr. Priya", "Artificial Intelligence"),
            ("Prof. Kumar", "Mathematics"),
            ("Dr. Meena", "Computer Science"),
            ("Prof. Arun", "Artificial Intelligence"),
        ]

        faculty = {}

        for name, department in faculty_data:
            faculty[name] = Faculty.objects.create(
                name=name,
                department=department,
            )

        # -------------------------------------------------
        # Rooms
        # -------------------------------------------------

        Room.objects.create(
            name="Room 101",
            capacity=60,
            room_type=Room.RoomType.CLASSROOM,
        )

        Room.objects.create(
            name="Room 102",
            capacity=60,
            room_type=Room.RoomType.CLASSROOM,
        )

        Room.objects.create(
            name="Room 201",
            capacity=55,
            room_type=Room.RoomType.CLASSROOM,
        )

        Room.objects.create(
            name="AI Lab",
            capacity=60,
            room_type=Room.RoomType.LAB,
        )

        Room.objects.create(
            name="Programming Lab",
            capacity=60,
            room_type=Room.RoomType.LAB,
        )

        # -------------------------------------------------
        # Subjects
        # -------------------------------------------------

        python = Subject.objects.create(
            code="CS201",
            name="Python Programming",
            subject_type=Subject.SubjectType.THEORY,
            weekly_sessions=3,
        )

        dbms = Subject.objects.create(
            code="CS202",
            name="Database Management Systems",
            subject_type=Subject.SubjectType.THEORY,
            weekly_sessions=3,
        )

        ml = Subject.objects.create(
            code="AI301",
            name="Machine Learning",
            subject_type=Subject.SubjectType.THEORY,
            weekly_sessions=3,
        )

        dsa = Subject.objects.create(
            code="CS203",
            name="Data Structures",
            subject_type=Subject.SubjectType.THEORY,
            weekly_sessions=3,
        )

        web = Subject.objects.create(
            code="CS204",
            name="Web Development",
            subject_type=Subject.SubjectType.THEORY,
            weekly_sessions=2,
        )

        python_lab = Subject.objects.create(
            code="CS205L",
            name="Python Programming Lab",
            subject_type=Subject.SubjectType.LAB,
            weekly_sessions=2,
        )

        ml_lab = Subject.objects.create(
            code="AI302L",
            name="Machine Learning Lab",
            subject_type=Subject.SubjectType.LAB,
            weekly_sessions=2,
        )

        mathematics = Subject.objects.create(
            code="MA201",
            name="Engineering Mathematics",
            subject_type=Subject.SubjectType.THEORY,
            weekly_sessions=3,
        )

        # -------------------------------------------------
        # Teaching Assignments
        # -------------------------------------------------

        assignments = [
            (cse_a, python, faculty["Dr. Anitha"]),
            (cse_a, dbms, faculty["Prof. Ravi"]),
            (cse_a, dsa, faculty["Dr. Meena"]),
            (cse_a, python_lab, faculty["Dr. Anitha"]),
            (cse_a, mathematics, faculty["Prof. Kumar"]),

            (cse_b, python, faculty["Dr. Anitha"]),
            (cse_b, web, faculty["Prof. Ravi"]),
            (cse_b, dsa, faculty["Dr. Meena"]),
            (cse_b, dbms, faculty["Prof. Ravi"]),
            (cse_b, mathematics, faculty["Prof. Kumar"]),

            (aiml_a, ml, faculty["Dr. Priya"]),
            (aiml_a, python, faculty["Dr. Anitha"]),
            (aiml_a, dsa, faculty["Dr. Meena"]),
            (aiml_a, ml_lab, faculty["Dr. Priya"]),
            (aiml_a, mathematics, faculty["Prof. Kumar"]),
        ]

        for division, subject, teacher in assignments:
            TeachingAssignment.objects.create(
                division=division,
                subject=subject,
                faculty=teacher,
            )

        # -------------------------------------------------
        # Periods
        # -------------------------------------------------

        days = [
            "MON",
            "TUE",
            "WED",
            "THU",
            "FRI",
        ]

        period_times = [
            (time(9, 0), time(10, 0)),
            (time(10, 0), time(11, 0)),
            (time(11, 15), time(12, 15)),
            (time(12, 15), time(13, 15)),
            (time(14, 0), time(15, 0)),
            (time(15, 0), time(16, 0)),
        ]

        for day_code in days:

            for number, (start, end) in enumerate(
                period_times,
                start=1,
            ):
                Period.objects.create(
                    day=day_code,
                    period_number=number,
                    start_time=start,
                    end_time=end,
                )

        # -------------------------------------------------
        # Success message
        # -------------------------------------------------

        self.stdout.write("")

        self.stdout.write(
            self.style.SUCCESS(
                "Demo data created successfully!"
            )
        )

        self.stdout.write(
            f"Divisions: {Division.objects.count()}"
        )

        self.stdout.write(
            f"Faculty: {Faculty.objects.count()}"
        )

        self.stdout.write(
            f"Rooms: {Room.objects.count()}"
        )

        self.stdout.write(
            f"Subjects: {Subject.objects.count()}"
        )

        self.stdout.write(
            f"Teaching assignments: "
            f"{TeachingAssignment.objects.count()}"
        )

        self.stdout.write(
            f"Periods: {Period.objects.count()}"
        )