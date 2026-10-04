import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
  Stethoscope,
  Users,
  CalendarCheck,
  ClipboardPenLine,
  FileCheck2,
  UserCheck,
  PanelLeft,
  Search,
  Sun,
  Moon,
  LogOut,
  Hospital,
} from "lucide-react";

const doctorNavItems = [
  { path: "/doctor/dashboard", label: "Patient Queue & Stats", icon: Users },
  { path: "/doctor/appointments", label: "Manage Appointments", icon: CalendarCheck },
  { path: "/doctor/consultations", label: "Clinical Notes & Rx", icon: ClipboardPenLine },
  { path: "/doctor/reports", label: "Patient Lab Reports", icon: FileCheck2 },
  { path: "/doctor/profile", label: "Profile & Availability", icon: UserCheck },
];

export default function DoctorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const docName = user?.name
    ? user.name.startsWith("Dr.")
      ? user.name
      : `Dr. ${user.name}`
    : "Dr. Physician";

  const specialty = user?.specialty || "General Physician";

  return (
    <div className="dash-layout doctor-theme" data-theme={theme}>
      {sidebarOpen && (
        <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`dash-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="dash-brand">
          <div className="brand-logo" style={{ background: "linear-gradient(135deg, #0284c7, #0ea5e9)" }}>
            <Stethoscope size={20} />
          </div>
          <div>
            <div className="brand-name">Care Team Hub</div>
            <div className="dash-brand-sub">Clinical Provider Portal</div>
          </div>
        </div>

        <div
          style={{
            padding: "12px 14px",
            background: "var(--muted)",
            borderRadius: 10,
            margin: "12px 12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#0284c7",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            MD
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--fg)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {docName}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--muted-fg)",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Hospital size={11} color="#0284c7" /> {specialty}
            </div>
          </div>
        </div>

        <div className="dash-nav-label">Clinical Workflow</div>
        <nav className="dash-nav">
          {doctorNavItems.map((item) => (
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
              transition: "all 0.2s",
            }}
          >
            <LogOut size={15} /> Sign out
          </button>
          <div className="dash-notice">
            <strong>Clinical Portal</strong>
            Review patient preps, diagnostic reports & write prescriptions.
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
            <input placeholder="Search patient name, appointment ID, symptoms..." />
          </div>

          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              background: "var(--primary-soft)",
              color: "var(--primary)",
              padding: "6px 12px",
              borderRadius: 20,
              display: "none",
            }}
            className="hide-mobile-badge"
          >
            {docName} · {specialty}
          </span>

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
