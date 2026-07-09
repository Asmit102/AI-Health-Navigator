import { Heart, UserPlus } from "lucide-react";
import Button from "../../components/Button";

const members = [
  { id: 1, name: "Ananya Sharma", relation: "Self", age: 32, initials: "AS", bg: "#dff2f4", fg: "#1f9aa8", reminders: 1 },
  { id: 2, name: "Rohit Sharma", relation: "Spouse", age: 35, initials: "RS", bg: "#dbeafe", fg: "#2563eb", reminders: 0 },
  { id: 3, name: "Aarav Sharma", relation: "Son", age: 6, initials: "AS", bg: "#dcfce7", fg: "#16a34a", reminders: 2 },
  { id: 4, name: "Sunita Sharma", relation: "Mother", age: 62, initials: "SS", bg: "#fef3c7", fg: "#d97706", reminders: 3 },
];

export default function FamilyRecords() {
  return (
    <div>
      <div className="family-header-row">
        <div>
          <div className="family-title">
            <Heart size={22} /> Family Health Hub
          </div>
          <div className="family-sub">Manage health records for the whole family in one place.</div>
        </div>
        <Button as="button">
          <UserPlus size={16} /> Add member
        </Button>
      </div>

      <div className="family-grid">
        {members.map((m) => (
          <div key={m.id} className="card member-card">
            <div className="member-avatar" style={{ background: m.bg, color: m.fg }}>
              {m.initials}
            </div>
            <div className="member-name">{m.name}</div>
            <div className="member-meta">{m.relation} · {m.age}y</div>
            <span className={`reminder-pill ${m.reminders > 0 ? "has-reminders" : "all-clear"}`}>
              {m.reminders > 0 ? `${m.reminders} reminder${m.reminders > 1 ? "s" : ""}` : "All clear"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}