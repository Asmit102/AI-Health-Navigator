import { Stethoscope, Users, FileText, CalendarClock } from "lucide-react";
import Button from "../../components/Button";

const stats = [
  { icon: Users, value: 12, label: "Today's patients", bg: "#dff2f4", fg: "var(--primary)" },
  { icon: FileText, value: 9, label: "Pre-filled summaries", bg: "#dff2f4", fg: "var(--primary)" },
  { icon: CalendarClock, value: 5, label: "Follow-ups due", bg: "#dff2f4", fg: "var(--primary)" },
];

const queue = [
  { id: 1, name: "Ananya Sharma", age: 32, initials: "AS", reason: "Headache, mild fever — 5 days", time: "10:30 AM", status: "ready" },
  { id: 2, name: "Rohit Verma", age: 41, initials: "RV", reason: "Follow-up: hypertension review", time: "11:00 AM", status: "ready" },
  { id: 3, name: "Priya Mehta", age: 28, initials: "PM", reason: "Skin rash, suspected allergy", time: "11:30 AM", status: "waiting" },
  { id: 4, name: "Karan Singh", age: 55, initials: "KS", reason: "Diabetes follow-up + report review", time: "12:00 PM", status: "ready" },
];

export default function DoctorDashboard() {
  return (
    <div>
      <div className="doc-header-row">
        <div>
          <div className="doc-title">
            <Stethoscope size={22} /> Care Team Dashboard
          </div>
          <div className="doc-sub">Patient-prepared summaries — less repetition, more care.</div>
        </div>
        <span className="doc-badge">Dr. Rakesh Mehta · General Physician</span>
      </div>

      <div className="doc-stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.fg }}>
              <s.icon size={18} />
            </div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="queue-panel-title">Today's queue</div>

        <div className="queue-list">
          {queue.map((q) => (
            <div key={q.id} className="queue-item">
              <div className="queue-avatar">{q.initials}</div>
              <div className="queue-info">
                <div className="queue-patient-name">
                  {q.name} <span>· {q.age}y</span>
                </div>
                <div className="queue-reason">{q.reason}</div>
              </div>
              <div className="queue-time">{q.time}</div>
              <span className={`queue-status ${q.status}`}>
                {q.status === "ready" ? "Ready" : "Waiting"}
              </span>
              <div className="queue-actions">
                <Button as="button">Open summary</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}