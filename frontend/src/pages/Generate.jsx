import {
  WandSparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function Generate({
  onGenerate,
  loading,
  message,
  error,
  stats,
}) {
  return (
    <>
      {/* Page Header */}
      <header className="page-header">
        <div>
          <span className="eyebrow">
            SCHEDULING ENGINE
          </span>

          <h2>Generate Timetable</h2>

          <p>
            Build a timetable while enforcing the
            configured hard constraints.
          </p>
        </div>
      </header>

      {/* Generation Configuration */}
      <section className="generation-layout">
        <div className="generation-card">
          <div className="generation-icon">
            <WandSparkles size={25} />
          </div>

          <h3>Ready to generate</h3>

          <p>
            SmartSched will evaluate the available
            divisions, faculty, rooms and periods,
            then construct a conflict-free schedule.
          </p>

          <button
            className="primary-button large"
            onClick={onGenerate}
            disabled={loading}
          >
            <WandSparkles size={18} />

            {loading
              ? "Generating Schedule..."
              : "Generate Timetable"}
          </button>
        </div>

        {/* Current Configuration */}
        <div className="configuration-card">
          <h3>Current Configuration</h3>

          <div className="config-row">
            <span>Divisions</span>
            <strong>{stats.divisions}</strong>
          </div>

          <div className="config-row">
            <span>Faculty</span>
            <strong>{stats.faculty}</strong>
          </div>

          <div className="config-row">
            <span>Rooms</span>
            <strong>{stats.rooms}</strong>
          </div>

          <div className="config-row">
            <span>Subjects</span>
            <strong>{stats.subjects}</strong>
          </div>

          <div className="config-row">
            <span>Available periods</span>
            <strong>{stats.periods}</strong>
          </div>
        </div>
      </section>

      {/* Hard Constraints */}
      <section className="panel constraint-panel">
        <div className="panel-header">
          <div>
            <span className="section-label">
              VALIDATION RULES
            </span>

            <h3>Hard Constraints</h3>

            <p>
              Rules that must be satisfied before a
              timetable is accepted.
            </p>
          </div>
        </div>

        <div className="constraint-list">
          <div>
            <CheckCircle2 />
            <span>
              Faculty cannot teach two divisions in
              the same period.
            </span>
          </div>

          <div>
            <CheckCircle2 />
            <span>
              A division cannot have two classes in
              the same period.
            </span>
          </div>

          <div>
            <CheckCircle2 />
            <span>
              A room cannot host two classes in the
              same period.
            </span>
          </div>

          <div>
            <CheckCircle2 />
            <span>
              Room capacity must accommodate the
              division strength.
            </span>
          </div>

          <div>
            <CheckCircle2 />
            <span>
              Laboratory subjects require compatible
              laboratory rooms.
            </span>
          </div>

          <div>
            <CheckCircle2 />
            <span>
              Each teaching assignment must receive
              its required weekly sessions.
            </span>
          </div>
        </div>
      </section>

      {/* Generation Result */}
      {message && (
        <div className="result-banner success">
          <CheckCircle2 />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="result-banner error">
          <AlertCircle />
          <span>{error}</span>
        </div>
      )}
    </>
  );
}

export default Generate;