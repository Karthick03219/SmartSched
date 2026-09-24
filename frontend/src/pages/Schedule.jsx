import { useMemo, useState } from "react";
import TimetableGrid from "../components/TimetableGrid";

function Schedule({ timetable, onRefresh }) {
  const [selectedDivision, setSelectedDivision] =
    useState("ALL");

  const divisions = useMemo(() => {
    return [
      ...new Set(
        timetable.map(
          (entry) => entry.division.name
        )
      ),
    ];
  }, [timetable]);

  function handleDivisionChange(event) {
    setSelectedDivision(event.target.value);
  }

  return (
    <>
      {/* Page Header */}
      <header className="page-header">
        <div>
          <span className="eyebrow">
            SCHEDULE MANAGEMENT
          </span>

          <h2>Weekly Schedule</h2>

          <p>
            Review the generated timetable by
            division.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={onRefresh}
        >
          Refresh
        </button>
      </header>

      {/* Schedule Panel */}
      <section className="panel">
        <div className="filter-bar">
          <div>
            <label htmlFor="division-filter">
              View division
            </label>

            <select
              id="division-filter"
              value={selectedDivision}
              onChange={handleDivisionChange}
            >
              <option value="ALL">
                All Divisions
              </option>

              {divisions.map((division) => (
                <option
                  key={division}
                  value={division}
                >
                  {division}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TimetableGrid
          timetable={timetable}
          selectedDivision={selectedDivision}
        />
      </section>
    </>
  );
}

export default Schedule;