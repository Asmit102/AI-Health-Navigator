import { useState, useEffect } from "react";
import { Heart, UserPlus, X } from "lucide-react";
import Button from "../../components/Button";
import { addFamilyMember, getFamilyMembers, deleteFamilyMember } from "../../services/familyService";

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
    .toUpperCase() || "";

export default function FamilyRecords() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    relation: "",
    age: "",
    gender: "",
    notes: "",
  });

  const fetchMembers = async () => {
    try {
      const res = await getFamilyMembers();
      setMembers(res.members);
    } catch (err) {
      console.error("Failed to load family members", err);
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
      await addFamilyMember(form);
      setForm({ name: "", relation: "", age: "", gender: "", notes: "" });
      setShowForm(false);
      fetchMembers();
    } catch (err) {
      console.error("Failed to add family member", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await deleteFamilyMember(id);
      fetchMembers();
    } catch (err) {
      console.error("Failed to remove family member", err);
    }
  };

  if (loading) return <p style={{ color: "var(--muted-fg)" }}>Loading family records...</p>;

  return (
    <div>
      <div className="family-header-row">
        <div>
          <div className="family-title">
            <Heart size={22} /> Family Health Hub
          </div>
          <div className="family-sub">Manage health records for the whole family in one place.</div>
        </div>
        <Button as="button" onClick={() => setShowForm(true)}>
          <UserPlus size={16} /> Add member
        </Button>
      </div>

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: "var(--card)",
              borderRadius: 14,
              padding: 24,
              width: "100%",
              maxWidth: 420,
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowForm(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted-fg)",
              }}
            >
              <X size={18} />
            </button>

            <h3 style={{ marginBottom: 16, color: "var(--fg)" }}>Add Family Member</h3>

            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                required
                className="field-input"
              />
              <input
                name="relation"
                placeholder="Relation (e.g. Mother, Son)"
                value={form.relation}
                onChange={handleChange}
                required
                className="field-input"
              />
              <input
                name="age"
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                className="field-input"
              />
              <select name="gender" value={form.gender} onChange={handleChange} className="field-input">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <textarea
                name="notes"
                placeholder="Health notes (allergies, conditions, etc.)"
                value={form.notes}
                onChange={handleChange}
                className="field-input"
                rows={3}
              />

              <Button as="button" type="submit" disabled={submitting}>
                {submitting ? "Adding..." : "Add Member"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {members.length === 0 ? (
        <p style={{ color: "var(--muted-fg)" }}>No family members added yet.</p>
      ) : (
        <div className="family-grid">
          {members.map((m, i) => {
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
                <span className={`reminder-pill ${m.hasReminders ? "has-reminders" : "all-clear"}`}>
                  {m.hasReminders ? "Has reminders" : "All clear"}
                </span>
                <button
                  onClick={() => handleRemove(m._id)}
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: "var(--muted-fg)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}