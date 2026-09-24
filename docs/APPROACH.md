# SmartSched --- Approach Note

## 1. Problem Understanding

The assignment asks for a solution that generates and manages college
timetables across multiple divisions, subjects, faculty members,
classrooms, and periods while respecting hard constraints such as
teacher, classroom, and division conflicts, room requirements, and
scheduling relationships.

SmartSched treats timetable generation as a constraint satisfaction
problem rather than simply filling an empty grid.

## 2. Product Approach

The product is organized around five workflows:

1.  Overview --- understand the current scheduling dataset.
2.  Schedule --- review the generated timetable.
3.  Generate --- run the scheduling engine.
4.  Constraints --- explain the rules enforced by the engine.
5.  Data Setup --- understand the underlying scheduling data.

The central workflow is:

``` text
Scheduling Data
      ↓
Constraint Validation
      ↓
Candidate Generation
      ↓
Backtracking Search
      ↓
Valid Timetable
      ↓
Persistence
      ↓
Schedule Review
```

If no valid schedule exists, the generator returns an explicit failure
instead of silently creating an invalid timetable.

## 3. Architecture

``` text
+---------------------------+
| React + Vite Frontend     |
|                           |
| Overview / Schedule       |
| Generate / Constraints    |
| Data Setup                |
+-------------+-------------+
              |
          REST / JSON
              |
+-------------v-------------+
| Django + DRF API          |
|                           |
| Dashboard endpoint        |
| Generate endpoint         |
| Timetable endpoint        |
+-------------+-------------+
              |
+-------------v-------------+
| TimetableGenerator        |
|                           |
| Hard constraint checks    |
| Backtracking              |
| Candidate ordering        |
| Failure explanation       |
+-------------+-------------+
              |
+-------------v-------------+
| SQLite                    |
|                           |
| Divisions / Faculty       |
| Rooms / Subjects          |
| Assignments / Periods     |
| Timetable entries         |
+---------------------------+
```

## 4. Data Model

### Division

Stores the division name and student count.

### Faculty

Stores faculty information and department.

### Room

Stores room name, capacity, and room type.

### Subject

Stores subject code, name, subject type, and required weekly sessions.

### TeachingAssignment

Connects a division, subject, and faculty member.

### Period

Represents a day and period number with start/end time.

### TimetableEntry

Represents the generated placement of a teaching assignment into a room
and period.

## 5. Generation Algorithm

The engine uses recursive backtracking.

First, assignments are ordered by difficulty. Laboratory subjects are
prioritized because they have fewer compatible rooms, and larger
divisions are prioritized because fewer rooms can satisfy their capacity
requirement.

For each assignment, the engine creates candidate period/room
combinations.

A candidate is accepted only when:

-   the division is free in that period;
-   the faculty member is free in that period;
-   the room is free in that period;
-   room capacity is sufficient;
-   the room type satisfies the subject requirement.

The candidate is temporarily placed and the algorithm recursively
schedules the remaining assignments.

If the remaining assignments cannot be scheduled, the placement is
removed and another candidate is tried.

## 6. Candidate Ordering

The generator also uses current schedule usage to order candidates. The
ordering considers period load, division day load, subject/day load, day
load, day order, period number, and room id.

This is not a hard constraint. It is an engineering choice intended to
avoid unnecessary concentration in the earliest available periods while
preserving the correctness guarantees of the hard constraints.

## 7. Hard Constraints

The following constraints are treated as mandatory:

-   Division-period uniqueness
-   Faculty-period uniqueness
-   Room-period uniqueness
-   Room capacity
-   Laboratory room requirement
-   Required weekly session count

## 8. Failure Handling

The engine raises a `TimetableGenerationError` when it cannot produce a
valid timetable.

The API converts that failure into a structured response containing:

-   success status
-   message
-   conflict explanations

The frontend can therefore communicate why generation failed rather than
displaying an apparently valid but incorrect timetable.

## 9. Assumptions

For the demonstration:

-   The academic week is Monday-Friday.
-   Six teaching periods are configured per day.
-   The displayed academic year/semester information belongs to the demo
    presentation.
-   The prototype focuses on hard constraints.
-   Faculty availability and preferences are not currently modeled.
-   The demo dataset is seeded for repeatable evaluation.

These assumptions are intentionally kept separate from the assignment's
required hard constraints.

## 10. Trade-offs

### Understandability vs optimization

A custom backtracking engine makes the core scheduling logic easy to
explain during an assessment. For much larger production datasets, a
constraint programming/optimization solver could provide better
scalability and richer optimization.

### Simple persistence vs production infrastructure

SQLite reduces setup complexity for an evaluator. PostgreSQL would be a
more suitable production database.

### Hard constraints vs preference optimization

Correctness is prioritized over preferences. Soft candidate ordering is
used only after hard constraints are satisfied.

## 11. Validation and Edge Cases

The generator explicitly handles:

-   empty assignment data
-   empty period configuration
-   empty room configuration
-   no compatible room
-   insufficient periods for required sessions
-   unsatisfiable combinations of scheduling constraints

The normal demo generation is also checked by the same hard-constraint
logic before timetable entries are stored.

## 12. Why This Design

The design separates concerns:

-   React handles presentation and user interaction.
-   Django REST Framework exposes a small API.
-   The generation service owns scheduling logic.
-   Database models represent institutional scheduling entities.
-   The UI explains constraints rather than hiding the algorithm behind
    a simple Generate button.

This makes the prototype easier to test, explain, and extend.
