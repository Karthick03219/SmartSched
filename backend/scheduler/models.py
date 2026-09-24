from django.db import models


class Division(models.Model):
    name = models.CharField(max_length=100, unique=True)
    student_count = models.PositiveIntegerField()

    def __str__(self):
        return self.name


class Faculty(models.Model):
    name = models.CharField(max_length=150)
    department = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Room(models.Model):

    class RoomType(models.TextChoices):
        CLASSROOM = "CLASSROOM", "Classroom"
        LAB = "LAB", "Laboratory"

    name = models.CharField(max_length=100, unique=True)
    capacity = models.PositiveIntegerField()
    room_type = models.CharField(
        max_length=20,
        choices=RoomType.choices,
        default=RoomType.CLASSROOM,
    )

    def __str__(self):
        return f"{self.name} ({self.room_type})"


class Subject(models.Model):

    class SubjectType(models.TextChoices):
        THEORY = "THEORY", "Theory"
        LAB = "LAB", "Lab"

    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=150)
    subject_type = models.CharField(
        max_length=20,
        choices=SubjectType.choices,
        default=SubjectType.THEORY,
    )
    weekly_sessions = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.code} - {self.name}"


class TeachingAssignment(models.Model):
    division = models.ForeignKey(
        Division,
        on_delete=models.CASCADE,
        related_name="teaching_assignments",
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="teaching_assignments",
    )

    faculty = models.ForeignKey(
        Faculty,
        on_delete=models.CASCADE,
        related_name="teaching_assignments",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["division", "subject", "faculty"],
                name="unique_teaching_assignment",
            )
        ]

    def __str__(self):
        return (
            f"{self.division} | "
            f"{self.subject} | "
            f"{self.faculty}"
        )


class Period(models.Model):

    class Day(models.TextChoices):
        MONDAY = "MON", "Monday"
        TUESDAY = "TUE", "Tuesday"
        WEDNESDAY = "WED", "Wednesday"
        THURSDAY = "THU", "Thursday"
        FRIDAY = "FRI", "Friday"
        SATURDAY = "SAT", "Saturday"

    day = models.CharField(
        max_length=3,
        choices=Day.choices,
    )

    period_number = models.PositiveIntegerField()

    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        ordering = ["day", "period_number"]

        constraints = [
            models.UniqueConstraint(
                fields=["day", "period_number"],
                name="unique_day_period",
            )
        ]

    def __str__(self):
        return (
            f"{self.get_day_display()} - "
            f"Period {self.period_number}"
        )


class TimetableEntry(models.Model):
    teaching_assignment = models.ForeignKey(
        TeachingAssignment,
        on_delete=models.CASCADE,
        related_name="timetable_entries",
    )

    room = models.ForeignKey(
        Room,
        on_delete=models.PROTECT,
        related_name="timetable_entries",
    )

    period = models.ForeignKey(
        Period,
        on_delete=models.PROTECT,
        related_name="timetable_entries",
    )

    class Meta:
        constraints = [
            # Same teaching assignment cannot occur twice
            # in the same period.
            models.UniqueConstraint(
                fields=["teaching_assignment", "period"],
                name="unique_assignment_period",
            ),

            # Same room cannot be used twice
            # in the same period.
            models.UniqueConstraint(
                fields=["room", "period"],
                name="unique_room_period",
            ),
        ]

    def __str__(self):
        return (
            f"{self.teaching_assignment} | "
            f"{self.period} | "
            f"{self.room}"
        )