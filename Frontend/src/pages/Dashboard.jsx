import { useState } from "react";
import AiAssistant from "./dashboard/AiAssistant";
import {
  HeartPulse, LayoutGrid, Bot, ClipboardList, FileText, NotebookPen,
  CalendarDays, MapPin, LineChart, Users, Stethoscope, PanelLeft,
  Search, Bell,
} from "lucide-react";
import Overview from "./dashboard/Overview";

const patientNav = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "assistant", label: "AI Assistant", icon: Bot },
  { key: "prep", label: "Consultation Prep", icon: ClipboardList },
  { key: "reports", label: "Report Explainer", icon: FileText },
  { key: "memory", label: "Visit Memory", icon: NotebookPen },
  { key: "appointments", label: "Appointments", icon: CalendarDays },
  { key: "nearby", label: "Healthcare Near Me", icon: MapPin },
  { key: "timeline", label: "Health Timeline", icon: LineChart },
  { key: "family", label: "Family Records", icon: Users },
];

export default function Dashboard() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavClick = (key) => {
    setActive(key);
    setSidebarOpen(false); // mobile pe item click karte hi drawer band ho jaye
  };

  return (
    <div className="dash-layout">
      {sidebarOpen && (
        <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`dash-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="dash-brand">
          <div className="brand-logo"><HeartPulse size={20} /></div>
          <div>
            <div className="brand-name">Navigator</div>
            <div className="dash-brand-sub">Patient Health AI</div>
          </div>
        </div>

        <div className="dash-nav-label">Patient</div>
        <nav className="dash-nav">
          {patientNav.map((item) => (
            <div
              key={item.key}
              className={`dash-nav-item ${active === item.key ? "active" : ""}`}
              onClick={() => handleNavClick(item.key)}
            >
              <item.icon size={17} />
              {item.label}
            </div>
          ))}
        </nav>

        <div className="dash-nav-label">Care Team</div>
        <nav className="dash-nav">
          <div className="dash-nav-item">
            <Stethoscope size={17} />
            Doctor Dashboard
          </div>
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-notice">
            <strong>Not a medical service</strong>
            Information only — does not diagnose or prescribe.
          </div>
        </div>
      </aside>

      <div className="dash-main">
        <div className="dash-topbar">
          <button className="dash-icon-btn" onClick={() => setSidebarOpen((s) => !s)}>
            <PanelLeft size={16} />
          </button>
          <div className="dash-search">
            <Search size={16} />
            <input placeholder="Search records, doctors, medicines..." />
          </div>
          <button className="dash-icon-btn"><Bell size={16} /></button>
        </div>

        <div className="dash-content">
          <div className="dash-content-inner">
            {active === "overview" && <Overview />}
            {active === "assistant" && <AiAssistant />}
            {active !== "overview" && active !== "assistant" && (
              <div style={{ color: "var(--muted-fg)", fontSize: 14 }}>
                "{patientNav.find((n) => n.key === active)?.label}" page — coming soon.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}