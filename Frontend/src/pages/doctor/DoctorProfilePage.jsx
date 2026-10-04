import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Mail,
  Phone,
  Building,
  Clock,
  Award,
  Save,
  LogOut,
  ShieldCheck,
  Hospital,
  UserCheck,
  CheckCircle2,
  CalendarCheck,
  Sliders,
  Lock,
} from "lucide-react";
import { getProfile, updateProfile } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";

const specialties = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Neurologist",
  "ENT Specialist",
  "Internal Medicine",
  "Psychiatrist",
];

export default function DoctorProfilePage() {
  const { updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "General Physician",
    qualification: "",
    experience: "",
    clinicAddress: "",
    availability: "Mon-Sat: 9:00 AM - 5:00 PM",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [clinicSettings, setClinicSettings] = useState({
    acceptingNewPatients: true,
    teleconsultationEnabled: true,
    autoShareSummaries: true,
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
          specialty: u.specialty || "General Physician",
          qualification: u.qualification || "MBBS, MD",
          experience: u.experience || "10+ Years",
          clinicAddress: u.clinicAddress || "Apollo Multispecialty Clinic, Sector 12",
          availability: u.availability || "Mon-Sat: 9:00 AM - 5:00 PM",
        });
      } catch {
        setMessage("Failed to load doctor profile.");
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
      const res = await updateProfile(form);
      if (res.user) {
        updateUser(res.user);
      }
      setMessage("Doctor profile and clinical credentials updated successfully!");
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

  const displayName = form.name
    ? form.name.startsWith("Dr.")
      ? form.name
      : `Dr. ${form.name}`
    : "Dr. Physician";

  const initials = form.name
    ? form.name
        .replace(/^Dr\.\s*/i, "")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "MD";

  if (loading) {
    return (
      <div className="profile-page-container">
        <p style={{ color: "var(--muted-fg)", padding: 20 }}>Loading clinical credentials & practice settings...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      {/* Header Row */}
      <div className="profile-header-row">
        <div>
          <div className="profile-breadcrumb">
            CARE TEAM PORTAL <span>/</span> <span style={{ color: "var(--fg)" }}>DOCTOR CREDENTIALS & PRACTICE</span>
          </div>
          <h1 className="profile-title">Clinical Profile & Practice Settings</h1>
          <p className="profile-subtitle">
            Configure your medical qualifications, clinic affiliation, consultation hours, and patient scheduling visibility.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="profile-status-pill doctor">
            <UserCheck size={13} /> Active Provider Status
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
        {/* Left Column: Sidebar Profile Cards */}
        <div className="profile-sidebar">
          {/* Identity / Doctor Card */}
          <div className="profile-card">
            <div className="profile-avatar-banner" style={{ background: "linear-gradient(135deg, #0284c7, #0ea5e9)" }} />
            <div className="profile-avatar-body">
              <div className="profile-avatar-circle" style={{ background: "#0284c7", color: "#ffffff" }}>
                {initials}
              </div>
              <div className="profile-avatar-info">
                <div className="profile-avatar-name">{displayName}</div>
                <div className="profile-badge-row">
                  <span className="profile-status-pill doctor">
                    <ShieldCheck size={12} /> Certified Practitioner
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      background: "#e0f2fe",
                      color: "#0369a1",
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontWeight: 600,
                    }}
                  >
                    {form.specialty}
                  </span>
                </div>
              </div>

              {/* Quick Info List */}
              <div className="profile-info-list">
                <div className="profile-info-item">
                  <Hospital size={15} color="#0284c7" />
                  <span>{form.clinicAddress || "Clinic Address not provided"}</span>
                </div>
                <div className="profile-info-item">
                  <Award size={15} color="#0284c7" />
                  <span>{form.qualification ? `${form.qualification} · ${form.experience}` : "Qualifications pending"}</span>
                </div>
                <div className="profile-info-item">
                  <Clock size={15} color="#0284c7" />
                  <span>{form.availability || "Hours not set"}</span>
                </div>
                <div className="profile-info-item">
                  <Phone size={15} color="#0284c7" />
                  <span>{form.phone || "No clinic phone"}</span>
                </div>
                <div className="profile-info-item">
                  <Mail size={15} color="#0284c7" />
                  <span>{form.email || "No email"}</span>
                </div>
              </div>

              {/* Doctor Practice Stats */}
              <div className="profile-quick-stats">
                <div className="profile-stat-box">
                  <div className="profile-stat-val" style={{ color: "#0284c7" }}>
                    <Stethoscope size={16} style={{ display: "inline", verticalAlign: -2, marginRight: 4 }} />
                    Active
                  </div>
                  <div className="profile-stat-lbl">Care Queue</div>
                </div>
                <div className="profile-stat-box">
                  <div className="profile-stat-val" style={{ color: "#16a34a" }}>
                    <CalendarCheck size={16} style={{ display: "inline", verticalAlign: -2, marginRight: 4 }} />
                    Online
                  </div>
                  <div className="profile-stat-lbl">Appointments</div>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Session Card */}
          <div className="profile-card">
            <div className="profile-card-head">
              <div className="profile-card-title">
                <Lock size={16} color="#0284c7" /> Provider Session
              </div>
            </div>
            <div className="profile-card-body" style={{ padding: "16px 20px" }}>
              <p style={{ fontSize: 13, color: "var(--muted-fg)", lineHeight: 1.5, marginBottom: 14 }}>
                Secure clinical workstation session. Sign out when leaving shared hospital terminals.
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
                <LogOut size={15} /> Sign Out of Care Portal
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Practice Form & Booking Settings */}
        <div className="profile-main">
          {/* Main Edit Form Card */}
          <form onSubmit={handleSave}>
            <div className="profile-card">
              <div className="profile-card-head">
                <div className="profile-card-title">
                  <Stethoscope size={16} color="#0284c7" /> Medical Practice & Practitioner Credentials
                </div>
                <span style={{ fontSize: 12, color: "var(--muted-fg)" }}>Displayed in patient directory</span>
              </div>

              <div className="profile-card-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <div className="field-group">
                    <label className="field-label" htmlFor="docName">
                      <Award size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                      Doctor Full Name
                    </label>
                    <input
                      id="docName"
                      name="name"
                      type="text"
                      placeholder="e.g. Dr. Rakesh Mehta"
                      className="field-input"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="docSpecialty">
                      <Stethoscope size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                      Clinical Specialty
                    </label>
                    <select
                      id="docSpecialty"
                      name="specialty"
                      className="field-input"
                      value={form.specialty}
                      onChange={handleChange}
                    >
                      {specialties.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <div className="field-group">
                    <label className="field-label" htmlFor="docQual">
                      Medical Qualifications & Degrees
                    </label>
                    <input
                      id="docQual"
                      name="qualification"
                      placeholder="e.g. MBBS, MD (Internal Medicine), MRCP"
                      className="field-input"
                      value={form.qualification}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="docExp">
                      Clinical Experience (Years)
                    </label>
                    <input
                      id="docExp"
                      name="experience"
                      placeholder="e.g. 12 Years"
                      className="field-input"
                      value={form.experience}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <div className="field-group">
                    <label className="field-label" htmlFor="docEmail">
                      <Mail size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                      Registered Email Address
                    </label>
                    <input
                      id="docEmail"
                      name="email"
                      type="email"
                      className="field-input"
                      value={form.email}
                      disabled
                      style={{ opacity: 0.75, cursor: "not-allowed" }}
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="docPhone">
                      <Phone size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                      Clinic Contact Phone
                    </label>
                    <input
                      id="docPhone"
                      name="phone"
                      placeholder="+91 11 2345 6789"
                      className="field-input"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="docAddress">
                    <Building size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                    Clinic / Hospital Affiliation Address
                  </label>
                  <input
                    id="docAddress"
                    name="clinicAddress"
                    placeholder="e.g. Suite 302, Apollo Multispecialty Clinic, Sector 12"
                    className="field-input"
                    value={form.clinicAddress}
                    onChange={handleChange}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="docAvail">
                    <Clock size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                    Consultation Schedule & OPD Hours
                  </label>
                  <input
                    id="docAvail"
                    name="availability"
                    placeholder="e.g. Mon-Sat: 9:00 AM - 5:00 PM"
                    className="field-input"
                    value={form.availability}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="profile-card-footer">
                <span style={{ fontSize: 12.5, color: "var(--muted-fg)", display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle2 size={14} color="#16a34a" /> Credentials updated across patient scheduling directory.
                </span>
                <Button as="button" type="submit" disabled={saving}>
                  <Save size={15} style={{ marginRight: 6 }} />
                  {saving ? "Updating Credentials..." : "Save Doctor Profile"}
                </Button>
              </div>
            </div>
          </form>

          {/* Clinical Booking & Consultation Preferences Card */}
          <div className="profile-card">
            <div className="profile-card-head">
              <div className="profile-card-title">
                <Sliders size={16} color="#0284c7" /> Patient Consultation & Directory Preferences
              </div>
            </div>
            <div className="profile-card-body">
              <div className="setting-toggle-row">
                <div>
                  <div className="setting-info-title">Accept New Patient Appointments</div>
                  <div className="setting-info-desc">
                    Display your profile in patient search directories for booking new consultation slots.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={clinicSettings.acceptingNewPatients}
                  onChange={(e) =>
                    setClinicSettings({ ...clinicSettings, acceptingNewPatients: e.target.checked })
                  }
                  style={{ width: 18, height: 18, accentColor: "#0284c7", cursor: "pointer" }}
                />
              </div>

              <div className="setting-toggle-row">
                <div>
                  <div className="setting-info-title">AI Pre-Consultation Summaries</div>
                  <div className="setting-info-desc">
                    Receive AI structured symptom summaries and suggested questions before starting patient visits.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={clinicSettings.teleconsultationEnabled}
                  onChange={(e) =>
                    setClinicSettings({ ...clinicSettings, teleconsultationEnabled: e.target.checked })
                  }
                  style={{ width: 18, height: 18, accentColor: "#0284c7", cursor: "pointer" }}
                />
              </div>

              <div className="setting-toggle-row">
                <div>
                  <div className="setting-info-title">Automatic Prescription Memory Sync</div>
                  <div className="setting-info-desc">
                    Automatically convert written prescription instructions into simplified dosage timelines for patients.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={clinicSettings.autoShareSummaries}
                  onChange={(e) =>
                    setClinicSettings({ ...clinicSettings, autoShareSummaries: e.target.checked })
                  }
                  style={{ width: 18, height: 18, accentColor: "#0284c7", cursor: "pointer" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

