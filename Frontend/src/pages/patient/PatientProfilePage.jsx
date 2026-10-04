import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  Save,
  LogOut,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Bell,
  HeartPulse,
  Activity,
} from "lucide-react";
import { getProfile, updateProfile } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";

export default function PatientProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [notificationSettings, setNotificationSettings] = useState({
    emailSummaries: true,
    smsReminders: true,
    aiHealthAlerts: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const u = res.user;
        setForm({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          dateOfBirth: u.dateOfBirth ? u.dateOfBirth.split("T")[0] : "",
          gender: u.gender || "",
        });
      } catch {
        setMessage("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await updateProfile({
        name: form.name,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
      });
      if (res.user) {
        updateUser(res.user);
      }
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3500);
    } catch {
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = form.name
    ? form.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "PT";

  if (loading) {
    return (
      <div className="profile-page-container">
        <p style={{ color: "var(--muted-fg)", padding: 20 }}>Loading your personal health profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      {/* Header Row */}
      <div className="profile-header-row">
        <div>
          <div className="profile-breadcrumb">
            PATIENT PORTAL <span>/</span> <span style={{ color: "var(--fg)" }}>PROFILE & SETTINGS</span>
          </div>
          <h1 className="profile-title">Personal Health Profile</h1>
          <p className="profile-subtitle">
            Manage your personal medical identity, emergency information, and patient communication preferences.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="profile-status-pill verified">
            <ShieldCheck size={13} /> Account Active & Verified
          </span>
        </div>
      </div>

      {message && (
        <div
          style={{
            padding: "12px 18px",
            borderRadius: 10,
            marginBottom: 24,
            fontSize: 14,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: message.includes("success") ? "#e6f7ee" : "#fee2e2",
            color: message.includes("success") ? "#166534" : "#991b1b",
            border: `1px solid ${message.includes("success") ? "#bbf7d0" : "#fecaca"}`,
          }}
        >
          {message.includes("success") ? <CheckCircle2 size={16} /> : <Lock size={16} />}
          {message}
        </div>
      )}

      {/* 2-Column Responsive Layout Grid */}
      <div className="profile-layout-grid">
        {/* Left Column: Sidebar Cards */}
        <div className="profile-sidebar">
          {/* Identity / Avatar Banner Card */}
          <div className="profile-card">
            <div className="profile-avatar-banner" />
            <div className="profile-avatar-body">
              <div className="profile-avatar-circle">{initials}</div>
              <div className="profile-avatar-info">
                <div className="profile-avatar-name">{form.name || "Patient"}</div>
                <div className="profile-badge-row">
                  <span className="profile-status-pill verified">
                    <ShieldCheck size={12} /> Verified Patient
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      background: "var(--primary-soft)",
                      color: "var(--accent-fg)",
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontWeight: 600,
                    }}
                  >
                    ID: #PT-{(user?._id || "9283").slice(-4).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Quick Info List */}
              <div className="profile-info-list">
                <div className="profile-info-item">
                  <Mail size={15} />
                  <span>{form.email || "No email"}</span>
                </div>
                <div className="profile-info-item">
                  <Phone size={15} />
                  <span>{form.phone || "No phone added"}</span>
                </div>
                <div className="profile-info-item">
                  <Calendar size={15} />
                  <span>{form.dateOfBirth ? `DOB: ${form.dateOfBirth}` : "DOB not set"}</span>
                </div>
                <div className="profile-info-item">
                  <Users size={15} />
                  <span style={{ textTransform: "capitalize" }}>{form.gender ? `Gender: ${form.gender}` : "Gender not set"}</span>
                </div>
              </div>

              {/* Health Quick Stats */}
              <div className="profile-quick-stats">
                <div className="profile-stat-box">
                  <div className="profile-stat-val" style={{ color: "var(--primary)" }}>
                    <Activity size={16} style={{ display: "inline", verticalAlign: -2, marginRight: 4 }} />
                    Active
                  </div>
                  <div className="profile-stat-lbl">Health Status</div>
                </div>
                <div className="profile-stat-box">
                  <div className="profile-stat-val" style={{ color: "#16a34a" }}>
                    <ShieldCheck size={16} style={{ display: "inline", verticalAlign: -2, marginRight: 4 }} />
                    256-bit
                  </div>
                  <div className="profile-stat-lbl">Data Encryption</div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Security & Sign Out Card */}
          <div className="profile-card">
            <div className="profile-card-head">
              <div className="profile-card-title">
                <Lock size={16} color="var(--primary)" /> Account Security
              </div>
            </div>
            <div className="profile-card-body" style={{ padding: "16px 20px" }}>
              <p style={{ fontSize: 13, color: "var(--muted-fg)", lineHeight: 1.5, marginBottom: 14 }}>
                Your health records and clinical visit memory are encrypted and accessible only by you and your authorized care team.
              </p>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  background: "#fee2e2",
                  color: "#991b1b",
                  border: "1px solid #fecaca",
                  padding: "10px 16px",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 13.5,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <LogOut size={15} /> Sign Out of Account
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Main Form & Settings */}
        <div className="profile-main">
          {/* Main Edit Form Card */}
          <form onSubmit={handleSave}>
            <div className="profile-card">
              <div className="profile-card-head">
                <div className="profile-card-title">
                  <User size={16} color="var(--primary)" /> Personal & Demographic Details
                </div>
                <span style={{ fontSize: 12, color: "var(--muted-fg)" }}>All changes update instantly</span>
              </div>

              <div className="profile-card-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <div className="field-group">
                    <label className="field-label" htmlFor="name">
                      <User size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                      Full Legal Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g. Ananya Sharma"
                      className="field-input"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="email">
                      <Mail size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                      Email Address (Verified)
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="field-input"
                      value={form.email}
                      disabled
                      style={{ opacity: 0.75, cursor: "not-allowed" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <div className="field-group">
                    <label className="field-label" htmlFor="phone">
                      <Phone size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                      Phone Number (for SMS & Reminders)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      placeholder="+91 98765 43210"
                      className="field-input"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="dateOfBirth">
                      <Calendar size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                      Date of Birth
                    </label>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      className="field-input"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <div className="field-group">
                    <label className="field-label" htmlFor="gender">
                      <Users size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      className="field-input"
                      value={form.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="field-group">
                    <label className="field-label">
                      <HeartPulse size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                      Medical Profile Sync
                    </label>
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        background: "var(--muted)",
                        fontSize: 13,
                        color: "var(--muted-fg)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        height: 42,
                      }}
                    >
                      <CheckCircle2 size={15} color="#16a34a" /> Synced with AI Health Navigator
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-card-footer">
                <span style={{ fontSize: 12.5, color: "var(--muted-fg)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Lock size={13} /> Data is stored under HIPAA & ABDM digital privacy guidelines.
                </span>
                <Button as="button" type="submit" disabled={saving}>
                  <Save size={15} style={{ marginRight: 6 }} />
                  {saving ? "Saving Changes..." : "Save Profile Details"}
                </Button>
              </div>
            </div>
          </form>

          {/* Preferences & Communication Card */}
          <div className="profile-card">
            <div className="profile-card-head">
              <div className="profile-card-title">
                <Bell size={16} color="var(--primary)" /> Patient Communication & Notifications
              </div>
            </div>
            <div className="profile-card-body">
              <div className="setting-toggle-row">
                <div>
                  <div className="setting-info-title">Consultation Summary Emails</div>
                  <div className="setting-info-desc">
                    Receive simplified AI summaries and prescription memories automatically after each visit.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailSummaries}
                  onChange={(e) =>
                    setNotificationSettings({ ...notificationSettings, emailSummaries: e.target.checked })
                  }
                  style={{ width: 18, height: 18, accentColor: "var(--primary)", cursor: "pointer" }}
                />
              </div>

              <div className="setting-toggle-row">
                <div>
                  <div className="setting-info-title">Appointment & Medication Reminders</div>
                  <div className="setting-info-desc">
                    Get gentle SMS or email notifications for upcoming doctor checkups and daily medication schedules.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.smsReminders}
                  onChange={(e) =>
                    setNotificationSettings({ ...notificationSettings, smsReminders: e.target.checked })
                  }
                  style={{ width: 18, height: 18, accentColor: "var(--primary)", cursor: "pointer" }}
                />
              </div>

              <div className="setting-toggle-row">
                <div>
                  <div className="setting-info-title">AI Health Timeline Insights</div>
                  <div className="setting-info-desc">
                    Notify me when new lab reports, vital trends, or clinical follow-up recommendations are generated.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.aiHealthAlerts}
                  onChange={(e) =>
                    setNotificationSettings({ ...notificationSettings, aiHealthAlerts: e.target.checked })
                  }
                  style={{ width: 18, height: 18, accentColor: "var(--primary)", cursor: "pointer" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

