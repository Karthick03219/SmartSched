import {
  CalendarDays,
  LayoutDashboard,
  WandSparkles,
  ShieldCheck,
  Database,
} from "lucide-react";

const navigation = [
  {
    id: "dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: CalendarDays,
  },
  {
    id: "generate",
    label: "Generate",
    icon: WandSparkles,
  },
  {
    id: "constraints",
    label: "Constraints",
    icon: ShieldCheck,
  },
];

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <CalendarDays size={22} />
        </div>

        <div>
          <h1>SmartSched</h1>
          <span>Intelligent Scheduling</span>
        </div>
      </div>

      <div className="nav-section">
        <p className="nav-title">WORKSPACE</p>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={`nav-item ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="nav-section secondary-nav">
        <p className="nav-title">SYSTEM</p>

        <button
          className={`nav-item ${
            activePage === "data" ? "active" : ""
          }`}
          onClick={() => onNavigate("data")}
        >
          <Database size={18} />
          <span>Data Setup</span>
        </button>
      </div>

      <div className="sidebar-bottom">
        <div className="system-status">
          <span className="status-dot" />

          <div>
            <strong>System Operational</strong>
            <small>Scheduling engine ready</small>
          </div>
        </div>

        <span className="version">
          SmartSched v1.0
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;