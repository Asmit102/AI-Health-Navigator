import { useState, useEffect } from "react";
import { Heart, UserPlus, X, Trash2 } from "lucide-react";
import { addFamilyMember, getFamilyMembers, deleteFamilyMember } from "../../services/familyService";
import Button from "../../components/Button";

const avatarColors = [
  { bg: "#dff2f4", fg: "#1f9aa8" },
  { bg: "#dbeafe", fg: "#2563eb" },
  { bg: "#dcfce7", fg: "#16a34a" },
  { bg: "#fef3c7", fg: "#d97706" },
  { bg: "#fce7f3", fg: "#db2777" },
];

const getInitials = (name) =>
  name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "FM";

export default function FamilyRecordsPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    relation: "Mother",
    age: "",
    gender: "female",
    notes: "",
  });

  const fetchMembers = async () => {
    try {
      const res = await getFamilyMembers();
      setMembers(res.members || []);
    } catch (err) {
      console.error("Failed to load family records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addFamilyMember({
        ...form,
        age: form.age ? Number(form.age) : undefined,
      });
      setForm({ name: "", relation: "Mother", age: "", gender: "female", notes: "" });
      setShowForm(false);
      fetchMembers();
    } catch (err) {
      console.error("Failed to add family member:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this family member profile?")) return;
    try {
      await deleteFamilyMember(id);
      fetchMembers();
    } catch (err) {
      console.error("Failed to remove family member:", err);
    }
  };

  const defaultSampleMembers = [
    {
      _id: "fm-1",
      name: "Sunita Sharma",
      relation: "Mother",
      age: 58,
      notes: "Hypertension under control · Annual Cardiology review due in August",
      hasReminders: true,
    },
    {
      _id: "fm-2",
      name: "Aarav Sharma",
      relation: "Son",
      age: 8,
      notes: "Childhood asthma (mild) · Regular pediatrician checkups completed",
      hasReminders: false,
    },
  ];

  const displayMembers = members.length > 0 ? members : defaultSampleMembers;

  return (
    <div>
      <div className="family-header-row">
        <div>
          <div className="family-title">
            <Heart size={22} /> Family Health Hub
          </div>
          <div className="family-sub">
            Centralized health management, chronic condition tracking, and reminders for your entire family.
          </div>
        </div>

        <Button as="button" onClick={() => setShowForm(true)}>
          <UserPlus size={16} /> Add Family Member
        </Button>
      </div>

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              background: "var(--card)",
              borderRadius: 14,
              padding: 24,
              width: "100%",
              maxWidth: 440,
              boxShadow: "var(--shadow-soft)",
              border: "1px solid var(--border)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowForm(false)}
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted-fg)",
              }}
            >
              <X size={18} />
            </button>

            <h3 style={{ marginBottom: 4, color: "var(--fg)" }}>Add Family Member</h3>
            <p style={{ fontSize: 13, color: "var(--muted-fg)", marginBottom: 18 }}>
              Store records, allergy notes, and follow-up reminders.
            </p>

            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="field-group">
                <label className="field-label">Full Name</label>
                <input
                  name="name"
                  placeholder="e.g. Sunita Sharma"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="field-input"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field-group">
                  <label className="field-label">Relationship</label>
                  <input
                    name="relation"
                    placeholder="e.g. Mother, Father, Child"
                    value={form.relation}
                    onChange={handleChange}
                    required
                    className="field-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Age</label>
                  <input
                    name="age"
                    type="number"
                    placeholder="e.g. 58"
                    value={form.age}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="field-input"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">Health Notes / Medical Conditions</label>
                <textarea
                  name="notes"
                  placeholder="Known allergies, existing conditions, medications..."
                  value={form.notes}
                  onChange={handleChange}
                  className="field-input"
                  rows={3}
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <Button
                  as="button"
                  variant="outline"
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button as="button" type="submit" disabled={submitting} className="btn-block">
                  {submitting ? "Saving..." : "Add Member"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--muted-fg)" }}>Loading family members...</p>
      ) : (
        <div className="family-grid">
          {displayMembers.map((m, i) => {
            const color = avatarColors[i % avatarColors.length];
            return (
              <div key={m._id} className="card member-card">
                <div className="member-avatar" style={{ background: color.bg, color: color.fg }}>
                  {getInitials(m.name)}
                </div>
                <div className="member-name">{m.name}</div>
                <div className="member-meta">
                  {m.relation} {m.age ? `· ${m.age}y` : ""}
                </div>

                {m.notes && (
                  <p style={{ fontSize: 12, color: "var(--muted-fg)", margin: "10px 0", lineHeight: 1.4 }}>
                    {m.notes}
                  </p>
                )}

                <span className={`reminder-pill ${m.hasReminders ? "has-reminders" : "all-clear"}`}>
                  {m.hasReminders ? "Reminders Due" : "All Clear"}
                </span>

                <button
                  onClick={() => handleRemove(m._id)}
                  style={{
                    marginTop: 12,
                    fontSize: 12,
                    color: "#dc2626",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
