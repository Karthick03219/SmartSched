import { Fragment } from "react";
import { CalendarDays, DoorOpen, Users, Coffee, Utensils } from "lucide-react";
import { DAYS, PERIODS } from "../constants/timetable";

function TimetableGrid({ timetable, selectedDivision = "ALL" }) {
  const visibleEntries =
    selectedDivision === "ALL"
      ? timetable
      : timetable.filter(
          (entry) => entry.division.name === selectedDivision
        );

  function getEntries(day, periodNumber) {
    return visibleEntries.filter(
      (entry) =>
        entry.period.day_name === day &&
        entry.period.period_number === periodNumber
    );
  }

  const breakRowStyle = {
    background: "#f7f8fa",
    borderTop: "1px solid #e6e9ee",
    borderBottom: "1px solid #e6e9ee",
  };

  const breakCellStyle = {
    padding: "8px 12px",
    textAlign: "center",
    color: "#7b8494",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.02em",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "14px",
          padding: "14px 16px",
          border: "1px solid #e5eaf1",
          borderRadius: "10px",
          background: "#fafbfd",
        }}
      >
        <CalendarDays size={17} color="#526074" />

        <div>
          <div
            style={{
              color: "#202a3b",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            Academic Year 2026–27
          </div>

          <div
            style={{
              marginTop: "3px",
              color: "#7d8798",
              fontSize: "10px",
              fontWeight: 600,
            }}
          >
            6th Semester · 3rd Year · {selectedDivision === "ALL" ? "All Divisions" : selectedDivision}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "7px 10px",
            border: "1px solid #e5eaf1",
            borderRadius: "8px",
            background: "#fafbfd",
            color: "#687386",
            fontSize: "10px",
            fontWeight: 600,
          }}
        >
          <Coffee size={13} />
          Short Break · 11:00–11:15 AM
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "7px 10px",
            border: "1px solid #e5eaf1",
            borderRadius: "8px",
            background: "#fafbfd",
            color: "#687386",
            fontSize: "10px",
            fontWeight: 600,
          }}
        >
          <Utensils size={13} />
          Lunch Break · 1:15–2:00 PM
        </div>
      </div>

      <div className="timetable-wrapper">
        <table className="timetable">
          <thead>
            <tr>
              <th className="period-header">PERIOD</th>
              {DAYS.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {PERIODS.map((period) => (
              <Fragment key={period.number}>
                <tr>
                  <td className="period-column">
                    <strong>P{period.number}</strong>
                    <span>
                      {period.start} – {period.end}
                    </span>
                  </td>

                  {DAYS.map((day) => {
                    const entries = getEntries(day, period.number);

                    if (entries.length === 0) {
                      return (
                        <td key={day} className="empty-slot">
                          <span>Available</span>
                        </td>
                      );
                    }

                    return (
                      <td key={day}>
                        <div className="schedule-stack">
                          {entries.map((entry) => {
                            const isLab = entry.subject.type === "LAB";

                            return (
                              <div
                                className={`schedule-card ${isLab ? "lab" : ""}`}
                                key={entry.id}
                              >
                                <div className="schedule-code">
                                  {entry.subject.code}
                                </div>

                                <div className="schedule-name">
                                  {entry.subject.name}
                                </div>

                                <div className="schedule-meta">
                                  <Users size={12} />
                                  {entry.division.name}
                                </div>

                                <div className="schedule-meta">
                                  <DoorOpen size={12} />
                                  {entry.room.name}
                                </div>

                                <div className="schedule-faculty">
                                  {entry.faculty.name}
                                </div>

                                {isLab && (
                                  <span className="lab-badge">LAB</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {period.number === 2 && (
                  <tr style={breakRowStyle}>
                    <td style={breakCellStyle}>BREAK</td>
                    <td colSpan={DAYS.length} style={breakCellStyle}>
                      <Coffee
                        size={13}
                        style={{ verticalAlign: "middle", marginRight: 6 }}
                      />
                      Short Break · 11:00 – 11:15 AM
                    </td>
                  </tr>
                )}

                {period.number === 4 && (
                  <tr style={breakRowStyle}>
                    <td style={breakCellStyle}>BREAK</td>
                    <td colSpan={DAYS.length} style={breakCellStyle}>
                      <Utensils
                        size={13}
                        style={{ verticalAlign: "middle", marginRight: 6 }}
                      />
                      Lunch Break · 1:15 – 2:00 PM
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TimetableGrid;
