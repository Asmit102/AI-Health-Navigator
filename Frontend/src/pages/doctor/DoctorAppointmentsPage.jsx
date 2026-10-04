import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  User,
  CheckCircle,
  XCircle,
  FilePenLine,
} from "lucide-react";
import { getDoctorQueue, updateAppointmentStatus } from "../../services/doctorService";
import Button from "../../components/Button";

export default function DoctorAppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [feedback, setFeedback] = useState("");

  const fetchAppointments = async () => {
    try {
      const res = await getDoctorQueue();
      setAppointments(res.queue || []);
    } catch (err) {
      console.error("Failed to load doctor appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      setFeedback(`Appointment marked as ${newStatus}`);
      fetchAppointments();
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      console.error("Failed to update status:", err);
      setFeedback("Failed to update appointment status.");
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
          <div className="appt-page-title">Manage Patient Appointments</div>
          <div className="appt-page-sub">
            Review booked consultations, confirm schedules, and launch clinical encounters.
          </div>
        </div>
      </div>

      {feedback && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
            background: feedback.includes("Failed") ? "#fee2e2" : "#e6f7ee",
            color: feedback.includes("Failed") ? "#991b1b" : "#166534",
          }}
        >
          {feedback}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "pending", "confirmed", "in-progress", "completed"].map((tab) => (
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

      {loading ? (
        <p style={{ color: "var(--muted-fg)" }}>Loading appointments...</p>
      ) : filteredAppointments.length === 0 ? (
        <div className="panel" style={{ textAlign: "center", padding: "40px 20px" }}>
          <CalendarDays size={36} color="var(--primary)" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ color: "var(--fg)", marginBottom: 6 }}>No appointments in this category</h3>
          <p style={{ color: "var(--muted-fg)", fontSize: 14 }}>
            When patients book consultations with your clinic, they will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filteredAppointments.map((a) => {
            const pName = a.patient?.name || "Patient";
            const pPhone = a.patient?.phone || "No phone listed";

            return (
              <div key={a._id} className="panel" style={{ padding: "18px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>
                        {pName}
                      </span>
                      <span className={`status-pill ${a.status}`}>
                        {a.status}
                      </span>
                    </div>

                    <div style={{ fontSize: 13, color: "var(--muted-fg)", marginTop: 4, display: "flex", gap: 16 }}>
                      <span>
                        <Clock size={13} style={{ verticalAlign: -2, marginRight: 4 }} />
                        {new Date(a.date).toLocaleDateString()} at {a.time}
                      </span>
                      <span>
                        <User size={13} style={{ verticalAlign: -2, marginRight: 4 }} />
                        {pPhone}
                      </span>
                    </div>

                    <div style={{ fontSize: 14, color: "var(--fg)", marginTop: 8 }}>
                      <strong>Reason for Visit:</strong> {a.reason || "General Consultation"}
                    </div>
                  </div>

                  {/* Doctor Status Action Buttons */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {a.status === "pending" && (
                      <Button
                        as="button"
                        size="sm"
                        onClick={() => handleStatusChange(a._id, "confirmed")}
                      >
                        <CheckCircle size={14} /> Confirm Visit
                      </Button>
                    )}

                    {a.status !== "completed" && (
                      <Button
                        as="button"
                        size="sm"
                        variant={a.status === "in-progress" ? "primary" : "outline"}
                        onClick={() => navigate(`/doctor/consultations?id=${a._id}`)}
                      >
                        <FilePenLine size={14} /> Write Prescription / Note
                      </Button>
                    )}

                    {a.status === "in-progress" && (
                      <Button
                        as="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(a._id, "completed")}
                      >
                        <CheckCircle size={14} /> Mark Completed
                      </Button>
                    )}

                    {a.status !== "cancelled" && a.status !== "completed" && (
                      <Button
                        as="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStatusChange(a._id, "cancelled")}
                        style={{ color: "#dc2626" }}
                      >
                        <XCircle size={14} /> Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
