import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
  HeartPulse,
  LayoutGrid,
  Bot,
  ClipboardList,
  FileText,
  NotebookPen,
  CalendarDays,
  Activity,
  MapPin,
  LineChart,
  Users,
  PanelLeft,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
  ShieldCheck,
  Pill,
} from "lucide-react";

const navItems = [
  { path: "/patient/overview", label: "Overview", icon: LayoutGrid },
  { path: "/patient/assistant", label: "AI Health Assistant", icon: Bot },
  { path: "/patient/medications", label: "Rx Safety & Emergency Pass", icon: Pill },
  { path: "/patient/prep", label: "Consultation Prep", icon: ClipboardList },
  { path: "/patient/reports", label: "Report Explainer", icon: FileText },
  { path: "/patient/memory", label: "Visit Memory & Rx", icon: NotebookPen },
  { path: "/patient/appointments", label: "Appointments", icon: CalendarDays },
  { path: "/patient/vitals", label: "Vitals & Symptoms", icon: Activity },
  { path: "/patient/nearby", label: "Healthcare Near Me", icon: MapPin },
  { path: "/patient/timeline", label: "Health Timeline", icon: LineChart },
  { path: "/patient/family", label: "Family Health Hub", icon: Users },
  { path: "/patient/profile", label: "Profile Settings", icon: User },
];

export default function PatientLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "PT";

  return (
    <div className="dash-layout" data-theme={theme}>
      {sidebarOpen && (
        <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`dash-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="dash-brand">
          <div className="brand-logo">
            <HeartPulse size={20} />
          </div>
          <div>
            <div className="brand-name">Health Navigator</div>
            <div className="dash-brand-sub">Patient Health Portal</div>
          </div>
        </div>

        <div className="dash-user-card" style={{
          padding: "12px 14px",
          background: "var(--muted)",
          borderRadius: 10,
          margin: "12px 12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "var(--primary)",
            color: "var(--primary-fg)",
            display: "grid",
            placeItems: "center",
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", truncate: "true", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.name || "Patient"}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted-fg)", display: "flex", alignItems: "center", gap: 4 }}>
              <ShieldCheck size={11} color="var(--success)" /> Verified Patient
            </div>
          </div>
        </div>

        <div className="dash-nav-label">Navigation</div>
        <nav className="dash-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `dash-nav-item ${isActive ? "active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: "10px 14px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--muted-fg)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 12,
              transition: "all 0.2s"
            }}
          >
            <LogOut size={15} /> Sign out
          </button>
          <div className="dash-notice">
            <strong>Not a medical diagnosis</strong>
            Educational health aid — always consult your doctor.
          </div>
        </div>
      </aside>

      <div className="dash-main">
        <div className="dash-topbar">
          <button
            className="dash-icon-btn"
            onClick={() => setSidebarOpen((s) => !s)}
            aria-label="Toggle Sidebar"
          >
            <PanelLeft size={16} />
          </button>

          <div className="dash-search">
            <Search size={16} />
            <input placeholder="Search health records, reports, medications..." />
          </div>

          <button
            className="dash-icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="dash-content">
          <div className="dash-content-inner">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
