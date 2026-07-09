import { Plus, Clock, MapPin, Video, CalendarCheck } from "lucide-react";
import Button from "../../components/Button";

const upcoming = [
  {
    id: 1,
    mode: "in-person",
    dateLabel: "Tomorrow",
    doctor: "Dr. Rakesh Mehta",
    specialty: "General Physician",
    time: "10:30 AM",
    location: "Apollo Clinic, Sector 12",
  },
  {
    id: 2,
    mode: "in-person",
    dateLabel: "June 12",
    doctor: "Dr. Sneha Kapoor",
    specialty: "Dentist",
    time: "4:00 PM",
    location: "Smile Studio, MG Road",
  },
  {
    id: 3,
    mode: "video",
    dateLabel: "June 20",
    doctor: "Dr. Arjun Rao",
    specialty: "Cardiologist",
    time: "11:15 AM",
    location: "Tele-consult",
  },
];

const past = [
  { doctor: "Dr. Rakesh Mehta", specialty: "General Physician", date: "May 28" },
  { doctor: "Dr. Neha Iyer", specialty: "Dermatologist", date: "Apr 14" },
  { doctor: "Dr. Vikram Shah", specialty: "Orthopedic", date: "Mar 02" },
];

export default function Appointments() {
  return (
    <div>
      <div className="appt-header-row">
        <div>
          <div className="appt-page-title">Appointments</div>
          <div className="appt-page-sub">Manage upcoming consultations and follow-ups.</div>
        </div>
        <Button as="button">
          <Plus size={16} /> Book appointment
        </Button>
      </div>

      <div className="appt-upcoming-grid">
        {upcoming.map((a) => (
          <div key={a.id} className="card appt-card">
            <div className="appt-card-top">
              <span className={`mode-badge ${a.mode}`}>
                {a.mode === "video" ? <Video size={12} /> : <MapPin size={12} />}
                {a.mode}
              </span>
              <span className="appt-date-label">{a.dateLabel}</span>
            </div>

            <div className="appt-card-doctor">{a.doctor}</div>
            <div className="appt-card-specialty">{a.specialty}</div>

            <div className="appt-detail-row">
              <Clock size={14} /> {a.time}
            </div>
            <div className="appt-detail-row">
              <MapPin size={14} /> {a.location}
            </div>

            <div className="appt-card-actions">
              <Button as="button" variant="outline">Reschedule</Button>
              <Button as="button">Prepare</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-head">
          <span className="panel-title">
            <CalendarCheck size={16} style={{ marginRight: 8, verticalAlign: -2 }} />
            Past appointments
          </span>
        </div>
        <div className="past-appt-list">
          {past.map((p, i) => (
            <div key={i} className="past-appt-item">
              <span className="past-appt-name">
                {p.doctor} <span>· {p.specialty}</span>
              </span>
              <span className="past-appt-date">{p.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}