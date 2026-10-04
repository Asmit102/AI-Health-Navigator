import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Clock, MapPin, CalendarCheck, X, Stethoscope } from "lucide-react";
import {
  getMyAppointments,
  createAppointment,
  deleteAppointment,
} from "../../services/appointmentService";
import Button from "../../components/Button";

const specialties = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Neurologist",
  "ENT Specialist",
  "Gynecologist",
  "Psychiatrist",
];

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, confirmed, completed
  const [form, setForm] = useState({
    doctorName: "",
    specialty: "General Physician",
    date: new Date().toISOString().split("T")[0],
    time: "10:30 AM",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const fetchAppointments = async () => {
    try {
      const res = await getMyAppointments();
      setAppointments(res.appointments || []);
    } catch (err) {
      console.error("Failed to load appointments:", err);
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
    setFeedback("");
    try {
      await createAppointment(form);
      setForm({
        doctorName: "",
        specialty: "General Physician",
        date: new Date().toISOString().split("T")[0],
        time: "10:30 AM",
        reason: "",
      });
      setShowForm(false);
      setFeedback("Appointment booked successfully!");
      fetchAppointments();
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      console.error("Failed to book appointment:", err);
      setFeedback("Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await deleteAppointment(id);
      fetchAppointments();
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  return (
    <div>
      <div className="appt-header-row">
        <div>
          <div className="appt-page-title">Appointments & Consultations</div>
          <div className="appt-page-sub">
            Schedule new doctor visits, organize consultation preps, and manage follow-ups.
          </div>
        </div>

        <Button as="button" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Book Appointment
        </Button>
      </div>

      {feedback && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
            background: feedback.includes("success") ? "#e6f7ee" : "#fee2e2",
            color: feedback.includes("success") ? "#166534" : "#991b1b",
          }}
        >
          {feedback}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "pending", "confirmed", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              border: "1px solid var(--border)",
              background: filter === tab ? "var(--primary)" : "var(--card)",
              color: filter === tab ? "var(--primary-fg)" : "var(--muted-fg)",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {tab} ({appointments.filter((a) => (tab === "all" ? true : a.status === tab)).length})
          </button>
        ))}
      </div>

      {/* Modal Dialog */}
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
              maxWidth: 480,
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
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            <h3 style={{ marginBottom: 4, color: "var(--fg)" }}>Schedule Appointment</h3>
            <p style={{ fontSize: 13, color: "var(--muted-fg)", marginBottom: 20 }}>
              Choose a doctor and consultation details.
            </p>

            <form onSubmit={handleBook} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="field-group">
                <label className="field-label">Doctor Name</label>
                <input
                  name="doctorName"
                  placeholder="e.g. Dr. Rakesh Mehta"
                  value={form.doctorName}
                  onChange={handleChange}
                  required
                  className="field-input"
                />
              </div>

              <div className="field-group">
                <label className="field-label">Medical Specialty</label>
                <select
                  name="specialty"
                  value={form.specialty}
                  onChange={handleChange}
                  className="field-input"
                >
                  {specialties.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field-group">
                  <label className="field-label">Date</label>
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="field-input"
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Time Slot</label>
                  <input
                    name="time"
                    placeholder="e.g. 10:30 AM"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="field-input"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Chief Complaint / Reason for Visit</label>
                <input
                  name="reason"
                  placeholder="e.g. Persistent cough, routine blood pressure review"
                  value={form.reason}
                  onChange={handleChange}
                  className="field-input"
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
                  {submitting ? "Booking..." : "Confirm Appointment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--muted-fg)" }}>Loading appointments...</p>
      ) : filteredAppointments.length === 0 ? (
        <div className="panel" style={{ textAlign: "center", padding: "40px 20px" }}>
          <CalendarCheck size={36} color="var(--primary)" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ color: "var(--fg)", marginBottom: 6 }}>No appointments in this view</h3>
          <p style={{ color: "var(--muted-fg)", maxWidth: 440, margin: "0 auto 16px", fontSize: 14 }}>
            Book your next visit with a specialist or doctor to prepare your consultation questions.
          </p>
          <Button as="button" onClick={() => setShowForm(true)}>
            <Plus size={15} /> Book Appointment
          </Button>
        </div>
      ) : (
        <div className="appt-upcoming-grid">
          {filteredAppointments.map((a) => (
            <div key={a._id} className="card appt-card">
              <div className="appt-card-top">
                <span className={`mode-badge ${a.status === "confirmed" ? "online" : "in-person"}`}>
                  <Stethoscope size={12} />
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
                <div className="appt-detail-row" style={{ color: "var(--fg)", fontWeight: 500 }}>
                  <MapPin size={14} /> {a.reason}
                </div>
              )}

              <div className="appt-card-actions">
                <Button
                  as="button"
                  variant="outline"
                  onClick={() => handleCancel(a._id)}
                  disabled={a.status === "completed"}
                >
                  Cancel
                </Button>
                <Button
                  as="button"
                  onClick={() => navigate(`/patient/prep?id=${a._id}`)}
                >
                  Prepare Notes
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
