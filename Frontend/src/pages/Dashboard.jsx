import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import Profile from "./dashboard/Profile";
import AiAssistant from "./dashboard/AiAssistant";
import ConsultationPrep from "./dashboard/ConsultationPrep";
import ReportExplainer from "./dashboard/ReportExplainer";
import VisitMemory from "./dashboard/VisitMemory";
import Appointments from "./dashboard/Appointments";
import HealthcareNearMe from "./dashboard/HealthcareNearMe";
import HealthTimeline from "./dashboard/HealthTimeline";
import FamilyRecords from "./dashboard/FamilyRecords";
import DoctorDashboard from "./dashboard/DoctorDashboard";
import {
  HeartPulse, LayoutGrid, Bot, ClipboardList, FileText, NotebookPen,
  CalendarDays, MapPin, LineChart, Users, Stethoscope, PanelLeft,
  Search, Bell, Settings,
} from "lucide-react";
import Overview from "./dashboard/Overview";

const storedUser = JSON.parse(localStorage.getItem("user"));
const userRole = storedUser?.role || "patient";

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
  const [active, setActive] = useState(userRole === "doctor" ? "doctor" : "overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleNavClick = (key) => {
    setActive(key);
    setSidebarOpen(false); // mobile pe item click karte hi drawer band ho jaye
  };

  return (
    <div className="dash-layout" data-theme={theme}>
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

        {userRole === "patient" && (
          <>
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
          </>
        )}

        {userRole === "doctor" && (
          <>
            <div className="dash-nav-label">Care Team</div>
            <nav className="dash-nav">
                <div
                  className={`dash-nav-item ${active === "doctor" ? "active" : ""}`}
                  onClick={() => handleNavClick("doctor")}
                >
                  <Stethoscope size={17} />
                  Doctor Dashboard
            </div>
            </nav>
          </>
        )}

        <div className="dash-nav-label">Account</div>
        <nav className="dash-nav">
            <div
              className={`dash-nav-item ${active === "profile" ? "active" : ""}`}
              onClick={() => handleNavClick("profile")}
            >
              <Settings size={17} />
              Profile Settings
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
          <button className="dash-icon-btn" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="dash-icon-btn"><Bell size={16} /></button>
        </div>

        <div className="dash-content">
          <div className="dash-content-inner">
            {active === "overview" && <Overview />}
            {active === "assistant" && <AiAssistant />}
            {active === "prep" && <ConsultationPrep />}
            {active === "reports" && <ReportExplainer />}
            {active === "memory" && <VisitMemory />}
            {active === "appointments" && <Appointments />}
            {active === "nearby" && <HealthcareNearMe />}
            {active === "timeline" && <HealthTimeline />}
            {active === "family" && <FamilyRecords />}
            {active === "doctor" && <DoctorDashboard />}
            {active === "profile" && <Profile />}

            {active !== "overview" && active !== "assistant" && active !== "prep" && active !== "reports" && active !== "memory" && active !== "appointments" && active !== "nearby" && active !== "timeline" && active !== "family" && active!=="doctor" && active !== "profile" &&  (
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