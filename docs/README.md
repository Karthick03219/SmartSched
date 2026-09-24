# SmartSched

## Intelligent College Timetable Generation & Conflict Management System

SmartSched is a web-based timetable generation prototype for managing
college divisions, subjects, faculty members, classrooms, periods, and
teaching assignments.

The system generates a weekly timetable while enforcing hard scheduling
constraints and provides a human-readable failure response when the
configured data cannot produce a valid timetable.

## Problem

A college needs to generate and manage timetables across multiple
divisions, subjects, faculty members, classrooms, and periods. The
generator must prevent conflicts such as a faculty member teaching two
classes at the same time, a room being assigned twice, or a division
having overlapping classes.

## Key Features

-   Dashboard with current scheduling data
-   Weekly timetable view
-   Division-wise timetable filtering
-   Timetable generation using a constraint-based backtracking engine
-   Faculty conflict prevention
-   Division conflict prevention
-   Room conflict prevention
-   Room capacity validation
-   Laboratory room validation
-   Weekly session requirement validation
-   Human-readable failure/conflict messages
-   Data setup view
-   Constraint explanation view

## Technology Stack

### Frontend

-   React
-   Vite
-   JavaScript
-   Lucide React

### Backend

-   Python
-   Django
-   Django REST Framework

### Database

-   SQLite

## Architecture

``` text
React Frontend
      |
      | HTTP / JSON
      v
Django REST API
      |
      v
Timetable Generation Service
      |
      +--> Constraint validation
      +--> Backtracking search
      +--> Candidate ordering
      |
      v
SQLite Database
```

## Main Backend Models

-   Division
-   Faculty
-   Room
-   Subject
-   TeachingAssignment
-   Period
-   TimetableEntry

A TeachingAssignment connects a division, subject, and faculty member.
TimetableEntry stores the generated assignment, room, and period.

## Timetable Generation

The scheduling engine uses recursive backtracking.

The generator first prioritizes more constrained assignments, such as
laboratory subjects and larger divisions. It then checks available
period/room combinations against the hard constraints.

If a later placement causes a conflict, the algorithm removes the
previous placement and tries another candidate.

Candidate ordering also considers current period/day usage so that the
generated timetable is not unnecessarily concentrated in the earliest
available slots.

## Hard Constraints

1.  A division cannot have two classes in the same period.
2.  A faculty member cannot teach two classes in the same period.
3.  A room cannot host two classes in the same period.
4.  Room capacity must be at least the division's student count.
5.  Laboratory subjects require laboratory rooms.
6.  Each teaching assignment must receive its required weekly sessions.

## Failure Handling

If a valid timetable cannot be generated, the backend returns an
unsuccessful response with conflict information.

Examples include: - no teaching assignments - no periods - no rooms - no
compatible room for a subject/division - insufficient configured periods
for required sessions - a combination of constraints that cannot be
satisfied simultaneously

## Product Assumptions

The prototype uses a five-day Monday-Friday academic week with six
teaching periods per day. The frontend presents the timetable as
Academic Year 2026-27 and 6th Semester / 3rd Year for the demo dataset.

These academic labels and displayed time blocks are product/demo
assumptions rather than requirements prescribed by the assignment.

The prototype focuses on hard scheduling constraints. Additional
institutional rules such as faculty availability, preferred subject
distribution, holidays, and room-specific equipment can be added as
future constraints.

## Trade-offs

### Backtracking instead of a full optimization solver

Backtracking keeps the prototype understandable and makes constraint
failures explainable. A production-scale system could evaluate CP-SAT,
ILP, or another constraint programming approach for larger datasets.

### SQLite for the prototype

SQLite keeps setup simple for an assessment prototype. A production
deployment could use PostgreSQL.

### Demo data

The project includes seed data so the evaluator can run the system
immediately without manually creating every record.

## Validation

The generated demo timetable is checked by the scheduling engine before
it is persisted. The engine tracks division-period, faculty-period, and
room-period occupancy sets for fast conflict checks.

The UI also exposes the active hard constraints so an evaluator can
understand what the generator guarantees.

## API

-   `GET /api/health/`
-   `GET /api/dashboard/`
-   `POST /api/timetable/generate/`
-   `GET /api/timetable/`

## Running the Project

### Backend

``` cmd
cd backend
.venv\Scripts\activate
python manage.py migrate
python manage.py seed_demo
python manage.py runserver 127.0.0.1:8000
```

### Frontend

Open another terminal:

``` cmd
cd frontend
npm install
npm run dev
```

Then open:

``` text
http://localhost:5173
```

## Demo Flow

1.  Open Overview and verify system data.
2.  Open Generate and generate the timetable.
3.  Open Schedule and review the weekly timetable.
4.  Filter by CSE-A, CSE-B, and AI&ML-A.
5.  Open Constraints to explain the hard rules.
6.  Open Data Setup to show the configured data model.

## Scope

This is an assessment prototype focused on timetable generation and
conflict management. Authentication, role-based permissions, persistent
manual editing workflows, notifications, and advanced optimization are
outside the current prototype scope.
