import {
  Database,
  GraduationCap,
  Users,
  DoorOpen,
  BookOpen,
  Clock3,
  CalendarDays,
  Settings,
  ExternalLink,
} from "lucide-react";

const dataItems = [
  {
    key: "divisions",
    label: "Divisions",
    description:
      "Student groups used for timetable scheduling.",
    icon: GraduationCap,
  },
  {
    key: "faculty",
    label: "Faculty",
    description:
      "Faculty members assigned to teaching sessions.",
    icon: Users,
  },
  {
    key: "rooms",
    label: "Classrooms & Labs",
    description:
      "Rooms available for scheduled sessions.",
    icon: DoorOpen,
  },
  {
    key: "subjects",
    label: "Subjects",
    description:
      "Theory and laboratory subjects.",
    icon: BookOpen,
  },
  {
    key: "periods",
    label: "Periods",
    description:
      "Available time slots across the working week.",
    icon: Clock3,
  },
  {
    key: "timetable_entries",
    label: "Scheduled Sessions",
    description:
      "Classes currently assigned to timetable slots.",
    icon: CalendarDays,
  },
];

function DataSetup({ stats }) {
  return (
    <>
      {/* Page Header */}
      <header className="page-header">
        <div>
          <span className="eyebrow">
            MASTER DATA
          </span>

          <h2>Data Setup</h2>

          <p>
            Review the resources used by the timetable
            generation engine.
          </p>
        </div>

        <a
          className="primary-button"
          href="http://127.0.0.1:8000/admin/"
          target="_blank"
          rel="noreferrer"
        >
          <Settings size={17} />
          Manage Data
          <ExternalLink size={14} />
        </a>
      </header>

      {/* Master Data Summary */}
      <section className="constraint-summary">
        <div className="summary-icon">
          <Database size={24} />
        </div>

        <div>
          <strong>
            Scheduling master data
          </strong>

          <p>
            These resources are used by SmartSched
            when validating and generating timetables.
          </p>
        </div>
      </section>

      {/* Data Cards */}
      <section className="data-grid">
        {dataItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              className="data-card"
              key={item.key}
            >
              <div className="data-card-icon">
                <Icon size={20} />
              </div>

              <div className="data-card-content">
                <span>{item.label}</span>

                <strong>
                  {stats[item.key] ?? 0}
                </strong>

                <p>
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Data Management */}
      <section className="panel data-info-panel">
        <div className="panel-header">
          <div>
            <span className="section-label">
              DATA MANAGEMENT
            </span>

            <h3>Scheduling Resources</h3>

            <p>
              Maintain divisions, faculty, rooms,
              subjects and teaching assignments before
              generating a timetable.
            </p>
          </div>

          <a
            className="secondary-button"
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noreferrer"
          >
            Open Admin
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Workflow */}
        <div className="data-flow">
          <div>
            <strong>1</strong>
            <span>Define resources</span>
          </div>

          <div className="flow-arrow">
            →
          </div>

          <div>
            <strong>2</strong>
            <span>Assign faculty & subjects</span>
          </div>

          <div className="flow-arrow">
            →
          </div>

          <div>
            <strong>3</strong>
            <span>Generate timetable</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default DataSetup;