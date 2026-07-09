import { Activity, FileText, Stethoscope, Pill } from "lucide-react";

const events = [
  { id: 1, type: "symptom", title: "Mild headache logged", date: "Jun 1, 2026", desc: "Onset morning, no fever." },
  { id: 2, type: "report", title: "CBC report uploaded", date: "May 30, 2026", desc: "Hemoglobin slightly low; rest normal." },
  { id: 3, type: "visit", title: "Visited Dr. Rakesh Mehta", date: "May 28, 2026", desc: "Viral infection suspected. Rest + meds." },
  { id: 4, type: "rx", title: "Azithromycin 250mg started", date: "May 28, 2026", desc: "5-day course, once daily." },
  { id: 5, type: "visit", title: "Visited Dr. Neha Iyer", date: "Apr 14, 2026", desc: "Contact dermatitis diagnosed." },
  { id: 6, type: "report", title: "Thyroid panel uploaded", date: "Apr 12, 2026", desc: "All values within normal range." },
];

const iconMap = {
  symptom: Activity,
  report: FileText,
  visit: Stethoscope,
  rx: Pill,
};

export default function HealthTimeline() {
  return (
    <div>
      <div className="timeline-header-row">
        <div className="timeline-page-title">Health Journey Timeline</div>
        <div className="timeline-page-sub">Symptoms, reports, medicines and consultations over time.</div>
      </div>

      <div className="panel">
        <div className="timeline-panel-title">Recent activity</div>

        <div className="tl-list">
          {events.map((e) => {
            const Icon = iconMap[e.type];
            return (
              <div key={e.id} className="tl-item">
                <div className="tl-icon-col">
                  <div className={`tl-icon ${e.type}`}>
                    <Icon size={15} />
                  </div>
                  <div className="tl-line" />
                </div>
                <div className="tl-content">
                  <div className="tl-title-row">
                    <span className="tl-event-title">{e.title}</span>
                    <span className="tl-tag">{e.type}</span>
                  </div>
                  <div className="tl-date">{e.date}</div>
                  <div className="tl-desc">{e.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}