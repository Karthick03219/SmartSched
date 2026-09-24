import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Generate from "./pages/Generate";
import Constraints from "./pages/Constraints";
import DataSetup from "./pages/DataSetup";

import {
  getDashboardStats,
  getTimetable,
  generateTimetable,
} from "./services/api";

import "./App.css";


const INITIAL_STATS = {
  divisions: 0,
  faculty: 0,
  rooms: 0,
  subjects: 0,
  periods: 0,
  teaching_assignments: 0,
  timetable_entries: 0,
};


function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [stats, setStats] = useState(INITIAL_STATS);

  const [timetable, setTimetable] = useState([]);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");


  /*
   * Load dashboard statistics and timetable independently.
   *
   * This prevents one failed request from hiding data
   * successfully returned by the other request.
   */
  async function loadDashboardStats() {
    try {
      const dashboardData = await getDashboardStats();

      if (
        dashboardData &&
        dashboardData.success &&
        dashboardData.data
      ) {
        setStats(dashboardData.data);
      }

      return true;
    } catch (err) {
      console.error(
        "Dashboard request failed:",
        err
      );

      throw err;
    }
  }


  async function loadTimetable() {
    try {
      const timetableData = await getTimetable();

      if (
        timetableData &&
        timetableData.success
      ) {
        setTimetable(
          Array.isArray(timetableData.entries)
            ? timetableData.entries
            : []
        );
      } else {
        setTimetable([]);
      }

      return true;
    } catch (err) {
      console.error(
        "Timetable request failed:",
        err
      );

      throw err;
    }
  }


  /*
   * Load all application data.
   */
  async function loadData() {
    setError("");

    let dashboardLoaded = false;
    let timetableLoaded = false;

    try {
      await loadDashboardStats();
      dashboardLoaded = true;
    } catch (err) {
      console.error(err);
    }

    try {
      await loadTimetable();
      timetableLoaded = true;
    } catch (err) {
      console.error(err);
    }

    /*
     * Only show an application error if both
     * important API requests failed.
     */
    if (
      !dashboardLoaded &&
      !timetableLoaded
    ) {
      setError(
        "Unable to connect to the SmartSched API. " +
        "Make sure the Django backend is running."
      );

      return false;
    }

    /*
     * If at least one API request succeeded,
     * keep the application usable.
     */
    setError("");

    return true;
  }


  /*
   * Generate a completely new timetable.
   */
  async function handleGenerate() {
    try {
      setLoading(true);

      setMessage("");

      setError("");


      const result = await generateTimetable();


      if (
        result &&
        result.success
      ) {
        setMessage(
          result.message ||
          `Timetable generated successfully with ${
            result.total_entries || 0
          } sessions.`
        );
      } else {
        setMessage(
          `Timetable generated successfully with ${
            result?.total_entries || 0
          } sessions.`
        );
      }


      /*
       * Reload both statistics and timetable
       * after successful generation.
       */
      await loadData();

      return true;

    } catch (err) {

      console.error(
        "Generation failed:",
        err
      );

      setError(
        err?.message ||
        "Unable to generate the timetable."
      );

      return false;

    } finally {

      setLoading(false);
    }
  }


  /*
   * Load data when the application starts.
   */
  useEffect(() => {
    loadData();
  }, []);


  /*
   * Navigation between application pages.
   */
  function handleNavigation(page) {
    setActivePage(page);

    setMessage("");

    setError("");
  }


  /*
   * Render the selected page.
   */
  function renderPage() {

    switch (activePage) {

      case "schedule":

        return (
          <Schedule
            timetable={timetable}
            onRefresh={loadData}
          />
        );


      case "generate":

        return (
          <Generate
            onGenerate={handleGenerate}
            loading={loading}
            message={message}
            error={error}
            stats={stats}
          />
        );


      case "constraints":

        return (
          <Constraints />
        );


      case "data":

        return (
          <DataSetup
            stats={stats}
          />
        );


      case "dashboard":

      default:

        return (
          <Dashboard
            stats={stats}
            timetable={timetable}
            onGenerate={handleGenerate}
            onRefresh={loadData}
            loading={loading}
          />
        );
    }
  }


  return (
    <div className="app">

      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigation}
      />


      <main className="main-content">

        {error && (
          <div className="global-error">
            {error}
          </div>
        )}


        {renderPage()}

      </main>

    </div>
  );
}


export default App;