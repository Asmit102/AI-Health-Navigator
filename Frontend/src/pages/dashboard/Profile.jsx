import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Calendar, Users, Save, LogOut, ShieldCheck } from "lucide-react";
import { getProfile, updateProfile } from "../../services/authService";
import Button from "../../components/Button";

export default function Profile() {
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const user = res.user;
        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
          gender: user.gender || "",
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
      await updateProfile({
        name: form.name,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
      });
      setMessage("Profile updated successfully!");
    } catch {
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const initials = form.name
    ? form.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  if (loading) return <p style={{ color: "var(--muted-fg)" }}>Loading profile...</p>;

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-fg)", letterSpacing: 0.5, marginBottom: 8 }}>
        ACCOUNT <span style={{ margin: "0 6px" }}>/</span>
        <span style={{ color: "var(--fg)" }}>PROFILE SETTINGS</span>
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: "var(--fg)" }}>Profile Settings</h1>
      <p style={{ color: "var(--muted-fg)", fontSize: 14, marginTop: 8, marginBottom: 24, maxWidth: 560 }}>
        Keep your details current so AI Health Navigator can personalize your experience
        and provide more accurate guidance.
      </p>

      {message && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 20,
            fontSize: 14,
            background: message.includes("success") ? "#e6f7ee" : "#fde8e8",
            color: message.includes("success") ? "#1a7f4b" : "#c0392b",
          }}
        >
          {message}
        </div>
      )}

      {/* Card 1: Banner + Avatar */}
      <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--border)", marginBottom: 24 }}>
        <div
          style={{
            height: 96,
            background: "linear-gradient(135deg, #2f7d6e, #4fb7ab)",
          }}
        />
        <div style={{ background: "var(--card)", padding: "0 24px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: "var(--primary)",
              color: "var(--primary-fg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              border: "4px solid var(--card)",
              marginTop: -38,
            }}
          >
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)" }}>{form.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted-fg)", fontSize: 14 }}>
                <Mail size={14} /> {form.email}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "#e6f7ee",
                  color: "#1a7f4b",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                <ShieldCheck size={12} /> Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Personal Information */}
      <form onSubmit={handleSave}>
        <div style={{ border: "1px solid var(--border)", borderRadius: 14, background: "var(--card)", marginBottom: 24 }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>Personal information</div>
            <div style={{ fontSize: 13, color: "var(--muted-fg)", marginTop: 2 }}>
              Update your personal details below.
            </div>
          </div>

          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="field-group">
              <label className="field-label" htmlFor="name">
                <User size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                Full Name
              </label>
              <div className="field-input-wrap">
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="field-input"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="field-group">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label className="field-label" htmlFor="email">
                  <Mail size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                  Email
                </label>
                <span style={{ fontSize: 12, color: "var(--muted-fg)" }}>Cannot be changed</span>
              </div>
              <div className="field-input-wrap">
                <input id="email" name="email" type="email" className="field-input" value={form.email} disabled />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="field-group">
                <label className="field-label" htmlFor="phone">
                  <Phone size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                  Phone
                </label>
                <div className="field-input-wrap">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="+1 555 000 0000"
                    className="field-input"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="dateOfBirth">
                  <Calendar size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                  Date of Birth
                </label>
                <div className="field-input-wrap">
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
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="gender">
                <Users size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                Gender
              </label>
              <div className="field-input-wrap">
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
            </div>
          </div>

          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, color: "var(--primary)" }}>Changes are saved to your account securely.</span>
            <div style={{ display: "flex", gap: 10 }}>
              <Button as="button" variant="outline" type="button">
                Cancel
              </Button>
              <Button as="button" type="submit" disabled={saving}>
                <Save size={15} style={{ marginRight: 6, verticalAlign: -2 }} />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Card 3: Account session */}
      <div style={{ border: "1px solid var(--border)", borderRadius: 14, background: "var(--card)", marginBottom: 24 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>Account session</div>
          <div style={{ fontSize: 13, color: "var(--muted-fg)", marginTop: 2 }}>
            Sign out of your account on this device.
          </div>
        </div>
        <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--muted-fg)" }}>You'll be redirected to the sign-in page.</span>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#fde8e8",
              color: "#c0392b",
              border: "1px solid #f6c9c9",
              padding: "8px 16px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            <LogOut size={15} /> Log Out
          </button>
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--muted-fg)" }}>
        Not a medical service — information only, does not diagnose or prescribe.
      </p>
    </div>
  );
}