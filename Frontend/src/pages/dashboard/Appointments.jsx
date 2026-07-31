import { useState, useEffect } from "react";
import { Plus, Clock, MapPin, Video, CalendarCheck, X } from "lucide-react";
import Button from "../../components/Button";
import { getMyAppointments, createAppointment, deleteAppointment } from "../../services/appointmentService";

export default function Appointments({ onPrepare }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    doctorName: "",
    specialty: "",
    date: "",
    time: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await getMyAppointments();
      setAppointments(res.appointments);
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAppointment(form);
      setForm({ doctorName: "", specialty: "", date: "", time: "", reason: "" });
      setShowForm(false);
      fetchAppointments();
    } catch (err) {
      console.error("Failed to book appointment", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await deleteAppointment(id);
      fetchAppointments();
    } catch (err) {
      console.error("Failed to cancel appointment", err);
    }
  };

  if (loading) return <p style={{ color: "var(--muted-fg)" }}>Loading appointments...</p>;

  return (
    <div>
      <div className="appt-header-row">
        <div>
          <div className="appt-page-title">Appointments</div>
          <div className="appt-page-sub">Manage upcoming consultations and follow-ups.</div>
        </div>
        <Button as="button" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Book appointment
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

            <h3 style={{ marginBottom: 16, color: "var(--fg)" }}>Book Appointment</h3>

            <form onSubmit={handleBook} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                name="doctorName"
                placeholder="Doctor name"
                value={form.doctorName}
                onChange={handleChange}
                required
                className="field-input"
              />
              <input
                name="specialty"
                placeholder="Specialty (e.g. General Physician)"
                value={form.specialty}
                onChange={handleChange}
                required
                className="field-input"
              />
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                className="field-input"
              />
              <input
                name="time"
                placeholder="Time (e.g. 10:30 AM)"
                value={form.time}
                onChange={handleChange}
                required
                className="field-input"
              />
              <input
                name="reason"
                placeholder="Reason for visit"
                value={form.reason}
                onChange={handleChange}
                className="field-input"
              />

              <Button as="button" type="submit" disabled={submitting}>
                {submitting ? "Booking..." : "Confirm Booking"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {appointments.length === 0 && (
        <p style={{ color: "var(--muted-fg)", marginBottom: 20 }}>
          You have no appointments yet. Book one to get started.
        </p>
      )}

      <div className="appt-upcoming-grid">
        {appointments.map((a) => (
          <div key={a._id} className="card appt-card">
            <div className="appt-card-top">
              <span className="mode-badge in-person">
                <MapPin size={12} />
                {a.status}
              </span>
              <span className="appt-date-label">
                {new Date(a.date).toLocaleDateString()}
              </span>
            </div>

            <div className="appt-card-doctor">{a.doctorName}</div>
            <div className="appt-card-specialty">{a.specialty}</div>

            <div className="appt-detail-row">
              <Clock size={14} /> {a.time}
            </div>
            {a.reason && (
              <div className="appt-detail-row">
                <MapPin size={14} /> {a.reason}
              </div>
            )}

            <div className="appt-card-actions">
              <Button as="button" variant="outline" onClick={() => handleCancel(a._id)}>
                Cancel
              </Button>
              <Button as="button" onClick={onPrepare}>Prepare</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}