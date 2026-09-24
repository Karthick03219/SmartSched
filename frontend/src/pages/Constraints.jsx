import {
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

const constraints = [
  {
    title: "Faculty conflict prevention",
    description:
      "A faculty member cannot be assigned to multiple divisions during the same period.",
  },
  {
    title: "Division conflict prevention",
    description:
      "A division cannot have multiple classes scheduled during the same period.",
  },
  {
    title: "Room conflict prevention",
    description:
      "A room cannot be occupied by multiple classes during the same period.",
  },
  {
    title: "Room capacity validation",
    description:
      "The selected room must have enough capacity for the division.",
  },
  {
    title: "Laboratory requirement",
    description:
      "Laboratory subjects can only be assigned to compatible laboratory rooms.",
  },
  {
    title: "Weekly session requirement",
    description:
      "Each teaching assignment must receive the required number of weekly sessions.",
  },
];

function Constraints() {
  return (
    <>
      {/* Page Header */}
      <header className="page-header">
        <div>
          <span className="eyebrow">
            VALIDATION & RULES
          </span>

          <h2>Constraint Center</h2>

          <p>
            Rules used by the scheduling engine to
            produce valid timetables.
          </p>
        </div>
      </header>

      {/* Constraint Status */}
      <section className="constraint-summary">
        <div className="summary-icon">
          <ShieldCheck size={25} />
        </div>

        <div>
          <strong>
            Hard constraint engine active
          </strong>

          <p>
            Schedule generation will reject or explain
            configurations that cannot satisfy the
            required constraints.
          </p>
        </div>
      </section>

      {/* Constraint List */}
      <section className="constraint-grid">
        {constraints.map((constraint) => (
          <div
            className="constraint-card"
            key={constraint.title}
          >
            <CheckCircle2 />

            <div>
              <h3>{constraint.title}</h3>

              <p>{constraint.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Impossible Schedule Explanation */}
      <section className="explanation-card">
        <div className="warning-icon">
          <AlertTriangle />
        </div>

        <div>
          <h3>Impossible schedules</h3>

          <p>
            When the available resources cannot satisfy
            all hard constraints, SmartSched returns an
            explanation instead of silently producing an
            invalid timetable.
          </p>
        </div>
      </section>
    </>
  );
}

export default Constraints;