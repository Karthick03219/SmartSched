from collections import defaultdict

from .models import TimetableEntry


class TimetableGenerationError(Exception):
    """
    Raised when a valid timetable cannot be generated.
    """

    def __init__(self, message, conflicts=None):
        super().__init__(message)
        self.message = message
        self.conflicts = conflicts or []


class TimetableGenerator:
    """
    Constraint-based timetable generator.

    Hard constraints:
    1. A division cannot have two classes in the same period.
    2. A faculty member cannot teach two classes in the same period.
    3. A room cannot host two classes in the same period.
    4. Room capacity must be >= division strength.
    5. Lab subjects require lab rooms.
    6. Each teaching assignment must receive its required
       number of weekly sessions.

    Soft scheduling goals:
    1. Spread sessions across the working week.
    2. Avoid concentrating all classes in early periods.
    3. Avoid repeatedly scheduling the same subject on one day.
    """

    def __init__(self, assignments, periods, rooms):
        self.assignments = list(assignments)
        self.periods = list(periods)
        self.rooms = list(rooms)

        self.schedule = []

        # Used for fast hard-constraint checking.
        self.division_periods = defaultdict(set)
        self.faculty_periods = defaultdict(set)
        self.room_periods = defaultdict(set)

        # Used for soft scheduling preferences.
        self.division_day_load = defaultdict(int)
        self.subject_day_load = defaultdict(int)
        self.period_load = defaultdict(int)
        self.day_load = defaultdict(int)

        # Preserve the configured order of days.
        self.day_order = {}

        for period in self.periods:
            if period.day not in self.day_order:
                self.day_order[period.day] = len(self.day_order)

    def generate(self):
        """
        Generate a complete timetable.

        Returns:
            list of timetable entries as dictionaries.

        Raises:
            TimetableGenerationError if no valid timetable exists.
        """

        if not self.assignments:
            raise TimetableGenerationError(
                "No teaching assignments found.",
                [
                    "Create at least one teaching assignment "
                    "before generating the timetable."
                ],
            )

        if not self.periods:
            raise TimetableGenerationError(
                "No periods are configured.",
                [
                    "Create timetable periods before generating "
                    "the timetable."
                ],
            )

        if not self.rooms:
            raise TimetableGenerationError(
                "No classrooms are configured.",
                [
                    "Create at least one classroom or laboratory."
                ],
            )

        # Sort difficult assignments first.
        assignments = sorted(
            self.assignments,
            key=self._assignment_difficulty,
            reverse=True,
        )

        success = self._backtrack(assignments, 0)

        if not success:
            raise TimetableGenerationError(
                "A valid timetable could not be generated.",
                self._explain_failure(assignments),
            )

        return self.schedule

    def _backtrack(self, assignments, index):
        """
        Backtracking search.

        This allows the generator to undo a previous decision
        when it creates a conflict later.
        """

        if index >= len(assignments):
            return True

        assignment = assignments[index]

        required_sessions = assignment.subject.weekly_sessions

        return self._schedule_sessions(
            assignment,
            required_sessions,
            assignments,
            index,
        )

    def _schedule_sessions(
        self,
        assignment,
        remaining_sessions,
        assignments,
        index,
    ):
        """
        Schedule all weekly sessions for one assignment.
        """

        if remaining_sessions == 0:
            return self._backtrack(assignments, index + 1)

        candidates = self._get_candidates(assignment)

        for period, room in candidates:

            if not self._is_available(
                assignment,
                period,
                room,
            ):
                continue

            self._place(
                assignment,
                period,
                room,
            )

            if self._schedule_sessions(
                assignment,
                remaining_sessions - 1,
                assignments,
                index,
            ):
                return True

            self._remove(
                assignment,
                period,
                room,
            )

        return False

    def _get_candidates(self, assignment):
        """
        Return possible period-room combinations.

        Candidates are ordered using soft scheduling preferences.
        Hard constraints are checked separately in _is_available().
        """

        candidates = []

        for period in self.periods:
            for room in self.rooms:

                if not self._room_matches(
                    assignment,
                    room,
                ):
                    continue

                if not self._is_available(
                    assignment,
                    period,
                    room,
                ):
                    continue

                score = self._candidate_score(
                    assignment,
                    period,
                    room,
                )

                candidates.append(
                    (
                        score,
                        period,
                        room,
                    )
                )

        candidates.sort(
            key=lambda item: item[0]
        )

        return [
            (period, room)
            for _, period, room in candidates
        ]

    def _candidate_score(self, assignment, period, room):
        """
        Calculate a soft preference score.

        Lower is better.

        Priority:
        1. Less-loaded period.
        2. Less-loaded day for the division.
        3. Avoid repeating the same subject on a day.
        4. Less-loaded overall day.
        5. Stable configured day/period ordering.
        6. Stable room ordering.
        """

        division_id = assignment.division_id
        subject_id = assignment.subject_id

        day = period.day
        period_id = period.id
        room_id = room.id

        return (
            self.period_load[period_id],
            self.division_day_load[
                (division_id, day)
            ],
            self.subject_day_load[
                (subject_id, division_id, day)
            ],
            self.day_load[day],
            self.day_order.get(day, 999),
            period.period_number,
            room_id,
        )

    def _room_matches(self, assignment, room):
        """
        Check room-specific requirements.
        """

        division = assignment.division
        subject = assignment.subject

        # Capacity requirement.
        if room.capacity < division.student_count:
            return False

        # Lab subject requires lab room.
        if (
            subject.subject_type == "LAB"
            and room.room_type != "LAB"
        ):
            return False

        return True

    def _is_available(self, assignment, period, room):
        """
        Check all hard scheduling constraints.
        """

        division_id = assignment.division_id
        faculty_id = assignment.faculty_id
        room_id = room.id
        period_id = period.id

        # Division conflict.
        if period_id in self.division_periods[division_id]:
            return False

        # Faculty conflict.
        if period_id in self.faculty_periods[faculty_id]:
            return False

        # Room conflict.
        if period_id in self.room_periods[room_id]:
            return False

        return True

    def _place(self, assignment, period, room):
        """
        Temporarily place a class in the schedule.
        """

        self.schedule.append(
            {
                "teaching_assignment": assignment,
                "period": period,
                "room": room,
            }
        )

        division_id = assignment.division_id
        faculty_id = assignment.faculty_id
        subject_id = assignment.subject_id

        period_id = period.id
        room_id = room.id
        day = period.day

        # Hard constraint tracking.
        self.division_periods[
            division_id
        ].add(period_id)

        self.faculty_periods[
            faculty_id
        ].add(period_id)

        self.room_periods[
            room_id
        ].add(period_id)

        # Soft scheduling tracking.
        self.division_day_load[
            (division_id, day)
        ] += 1

        self.subject_day_load[
            (subject_id, division_id, day)
        ] += 1

        self.period_load[
            period_id
        ] += 1

        self.day_load[
            day
        ] += 1

    def _remove(self, assignment, period, room):
        """
        Remove a previous scheduling decision.
        """

        self.schedule.remove(
            {
                "teaching_assignment": assignment,
                "period": period,
                "room": room,
            }
        )

        division_id = assignment.division_id
        faculty_id = assignment.faculty_id
        subject_id = assignment.subject_id

        period_id = period.id
        room_id = room.id
        day = period.day

        # Hard constraint tracking.
        self.division_periods[
            division_id
        ].remove(period_id)

        self.faculty_periods[
            faculty_id
        ].remove(period_id)

        self.room_periods[
            room_id
        ].remove(period_id)

        # Soft scheduling tracking.
        self.division_day_load[
            (division_id, day)
        ] -= 1

        self.subject_day_load[
            (subject_id, division_id, day)
        ] -= 1

        self.period_load[
            period_id
        ] -= 1

        self.day_load[
            day
        ] -= 1

    def _assignment_difficulty(self, assignment):
        """
        Assign a difficulty score so constrained subjects
        are scheduled first.
        """

        score = 0

        # Laboratory subjects have fewer compatible rooms.
        if assignment.subject.subject_type == "LAB":
            score += 100

        # Larger divisions have fewer compatible rooms.
        score += assignment.division.student_count

        return score

    def _explain_failure(self, assignments):
        """
        Generate human-readable reasons when scheduling fails.
        """

        conflicts = []

        for assignment in assignments:

            subject = assignment.subject
            division = assignment.division

            compatible_rooms = [
                room
                for room in self.rooms
                if self._room_matches(
                    assignment,
                    room,
                )
            ]

            if not compatible_rooms:
                if subject.subject_type == "LAB":
                    conflicts.append(
                        f"{subject.code} for {division.name} "
                        f"requires a laboratory with capacity "
                        f"for {division.student_count} students, "
                        f"but no compatible lab is available."
                    )
                else:
                    conflicts.append(
                        f"{subject.code} for {division.name} "
                        f"requires a room with capacity "
                        f"for {division.student_count} students, "
                        f"but no compatible room is available."
                    )

                continue

            required_sessions = subject.weekly_sessions

            if required_sessions > len(self.periods):
                conflicts.append(
                    f"{subject.code} for {division.name} requires "
                    f"{required_sessions} weekly sessions, but only "
                    f"{len(self.periods)} periods are configured."
                )

        if not conflicts:
            conflicts.append(
                "The available periods, faculty, rooms, and "
                "division requirements cannot satisfy all "
                "hard constraints simultaneously."
            )

        return conflicts