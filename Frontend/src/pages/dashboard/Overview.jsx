import { Activity, CalendarDays, Pill, FileText, MessageSquare } from "lucide-react";
import Button from "../../components/Button";

const stats = [
  { icon: Activity, value: 3, label: "Active symptoms", bg: "#dff2f4", fg: "var(--primary)" },
  { icon: CalendarDays, value: 2, label: "Upcoming visits", bg: "#e0f2fe", fg: "#0284c7" },
  { icon: Pill, value: 4, label: "Medicines today", bg: "#dcfce7", fg: "#16a34a" },
  { icon: FileText, value: 12, label: "Reports filed", bg: "#fef3c7", fg: "#d97706" },
];

const medicines = [
  { name: "Paracetamol 500mg", time: "8:00 AM · After breakfast", status: "Taken" },
  { name: "Vitamin D3", time: "8:00 AM · After breakfast", status: "Taken" },
  { name: "Azithromycin 250mg", time: "2:00 PM · After lunch", status: "Due" },
  { name: "Cetirizine", time: "9:00 PM · Bedtime", status: "Due" },
];

export default function Overview() {
  return (
    <>
      <div className="dash-header-row">
        <div>
          <div className="dash-greeting">Good morning,</div>
          <div className="dash-username">Ananya</div>
        </div>
        <Button as="button">
          <MessageSquare size={16} /> Talk to assistant
        </Button>
      </div>

      <div className="stat-grid">
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

      <div className="dash-grid">
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Next appointment</span>
            <span className="pill">Tomorrow, 10:30 AM</span>
          </div>

          <div className="appt-doctor">Dr. Rakesh Mehta — General Physician</div>
          <div className="appt-sub">Apollo Clinic, Sector 12 · In-person</div>

          <div className="progress-row">
            <span>Consultation prep</span>
            <span>70%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: "70%" }} />
          </div>

          <div className="panel-actions">
            <Button as="button">Finish prep</Button>
            <Button as="button" variant="outline">Reschedule</Button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Today's medicines</span>
          </div>
          <div className="med-list">
            {medicines.map((m) => (
              <div key={m.name} className="med-item">
                <div>
                  <div className="med-name">{m.name}</div>
                  <div className="med-time">{m.time}</div>
                </div>
                <span className={`tag ${m.status === "Taken" ? "tag-taken" : "tag-due"}`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}