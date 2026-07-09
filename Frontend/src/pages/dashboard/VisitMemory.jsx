import { NotebookPen, CalendarClock, Pill } from "lucide-react";

const visits = [
  {
    id: 1,
    doctor: "Dr. Rakesh Mehta",
    specialty: "General Physician",
    date: "May 28, 2026",
    followUp: "Follow-up June 2, 2026",
    note: "Viral infection suspected. Rest, hydration, and monitor temperature. Return in 5 days if no improvement.",
    medicines: [
      "Paracetamol 500mg — 1 tab every 6h if fever",
      "Azithromycin 250mg — 1 tab daily x 5 days",
    ],
  },
  {
    id: 2,
    doctor: "Dr. Neha Iyer",
    specialty: "Dermatologist",
    date: "April 14, 2026",
    followUp: "Follow-up if rash persists past 10 days",
    note: "Mild contact dermatitis. Avoid new detergent. Topical cream twice daily for 7 days.",
    medicines: ["Mometasone cream — apply twice daily"],
  },
];

export default function VisitMemory() {
  return (
    <div>
      <div className="memory-header-row">
        <div className="memory-title">
          <NotebookPen size={22} /> Doctor Visit Memory
        </div>
        <div className="memory-sub">Every instruction, medicine, and follow-up saved in one place.</div>
      </div>

      <div className="visit-list">
        {visits.map((v) => (
          <div key={v.id} className="card visit-card">
            <div className="visit-card-head">
              <div>
                <div className="visit-doctor-name">{v.doctor}</div>
                <div className="visit-doctor-meta">{v.specialty} · {v.date}</div>
              </div>
              <span className="followup-pill">
                <CalendarClock size={13} /> {v.followUp}
              </span>
            </div>

            <p className="visit-note">{v.note}</p>

            <div className="visit-prescribed-label">Prescribed</div>
            <div className="visit-med-list">
              {v.medicines.map((m) => (
                <div key={m} className="visit-med-item">
                  <Pill size={15} /> {m}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}