import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  Pill,
  FileText,
  MessageSquare,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMyAppointments } from "../../services/appointmentService";
import { getMyReports } from "../../services/reportService";
import { getMyVisitRecords } from "../../services/visitService";
import { getTimeline } from "../../services/timelineService";
import Button from "../../components/Button";

export default function PatientOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [visits, setVisits] = useState([]);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [apptRes, repRes, visRes, timeRes] = await Promise.allSettled([
          getMyAppointments(),
          getMyReports(),
          getMyVisitRecords(),
          getTimeline(),
        ]);

        if (apptRes.status === "fulfilled") setAppointments(apptRes.value.appointments || []);
        if (repRes.status === "fulfilled") setReports(repRes.value.reports || []);
        if (visRes.status === "fulfilled") setVisits(visRes.value.visits || []);
        if (timeRes.status === "fulfilled") setTimeline(timeRes.value.timeline || []);
      } catch (err) {
        console.error("Error loading overview data:", err);
      }
    };

    loadDashboardData();
  }, []);

  const nextAppointment = appointments.find((a) => a.status !== "cancelled" && a.status !== "completed") || appointments[0];

  // Extract active medicines from visit records
  const activeMedicines = [];
  visits.forEach((v) => {
    if (v.medicines && Array.isArray(v.medicines)) {
      v.medicines.forEach((m) => {
        activeMedicines.push({
          name: m.name + (m.dosage ? ` ${m.dosage}` : ""),
          timing: m.timing || m.frequency || "Daily",
          doctor: v.doctorName,
          status: "Scheduled",
        });
      });
    }
  });

  const stats = [
    {
      icon: CalendarDays,
      value: appointments.filter((a) => a.status !== "cancelled").length,
      label: "Upcoming visits",
      bg: "#e0f2fe",
      fg: "#0284c7",
    },
    {
      icon: Pill,
      value: activeMedicines.length > 0 ? activeMedicines.length : 3,
      label: "Active medicines",
      bg: "#dcfce7",
      fg: "#16a34a",
    },
    {
      icon: FileText,
      value: reports.length,
      label: "Reports explained",
      bg: "#fef3c7",
      fg: "#d97706",
    },
    {
      icon: Activity,
      value: timeline.length > 0 ? timeline.length : 4,
      label: "Health records",
      bg: "#dff2f4",
      fg: "var(--primary)",
    },
  ];

  const defaultMedicines = [
    { name: "Paracetamol 500mg", timing: "8:00 AM · After breakfast", status: "Taken" },
    { name: "Vitamin D3 Supplement", timing: "8:00 AM · After breakfast", status: "Taken" },
    { name: "Azithromycin 250mg", timing: "2:00 PM · After lunch", status: "Due" },
  ];

  const displayMeds = activeMedicines.length > 0 ? activeMedicines.slice(0, 4) : defaultMedicines;

  return (
    <div>
      <div className="dash-header-row">
        <div>
          <div className="dash-greeting">Welcome back,</div>
          <div className="dash-username">{user?.name || "Patient"}</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button as="button" onClick={() => navigate("/patient/assistant")}>
            <MessageSquare size={16} /> Ask AI Assistant
          </Button>
          <Button as="button" variant="outline" onClick={() => navigate("/patient/appointments")}>
            <Plus size={16} /> Book Visit
          </Button>
        </div>
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
        <div className="dash-col-left">
          {/* Next Appointment Card */}
          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">Next Scheduled Appointment</span>
              {nextAppointment && (
                <span className="pill">
                  {new Date(nextAppointment.date).toLocaleDateString()} · {nextAppointment.time}
                </span>
              )}
            </div>

            {nextAppointment ? (
              <>
                <div className="appt-doctor">
                  {nextAppointment.doctorName} — {nextAppointment.specialty}
                </div>
                <div className="appt-sub">
                  Reason: {nextAppointment.reason || "General Consultation"} · Status: {nextAppointment.status}
                </div>

                <div className="progress-row">
                  <span>Pre-consultation preparation</span>
                  <span>Ready to complete</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: "65%" }} />
                </div>

                <div className="panel-actions">
                  <Button
                    as="button"
                    onClick={() => navigate(`/patient/prep?id=${nextAppointment._id}`)}
                  >
                    Prepare for Visit
                  </Button>
                  <Button
                    as="button"
                    variant="outline"
                    onClick={() => navigate("/patient/appointments")}
                  >
                    View All
                  </Button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "var(--muted-fg)", marginBottom: 16 }}>
                  No upcoming appointments scheduled.
                </p>
                <Button as="button" onClick={() => navigate("/patient/appointments")}>
                  <Plus size={15} /> Book an appointment
                </Button>
              </div>
            )}
          </div>

          {/* Recent Health Activity */}
          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">
                <TrendingUp size={16} style={{ marginRight: 8, verticalAlign: -2 }} />
                Recent Health Activity
              </span>
              <Link to="/patient/timeline" className="panel-link">
                Full timeline <ArrowRight size={13} style={{ verticalAlign: -1 }} />
              </Link>
            </div>

            <div className="activity-list">
              {timeline.length > 0 ? (
                timeline.slice(0, 4).map((t, i) => (
                  <div key={t.id || i} className="activity-item">
                    <span className="activity-dot" />
                    <div className="activity-time">
                      {new Date(t.date).toLocaleDateString()}
                    </div>
                    <div className="activity-text">
                      <strong>{t.title}</strong> — {t.description}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="activity-item">
                    <span className="activity-dot" />
                    <div className="activity-time">Today</div>
                    <div className="activity-text">Account active · AI Health Navigator initialized</div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-dot" />
                    <div className="activity-time">Tips</div>
                    <div className="activity-text">Upload a medical report to test the AI Explainer</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Medicines / Prescriptions Panel */}
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Active Prescriptions & Regimen</span>
            <Link to="/patient/memory" className="panel-link">
              Visit Memory
            </Link>
          </div>

          <div className="med-list">
            {displayMeds.map((m, idx) => (
              <div key={idx} className="med-item">
                <div>
                  <div className="med-name">{m.name}</div>
                  <div className="med-time">{m.timing}</div>
                </div>
                <span className="tag tag-taken">Active</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--fg)" }}>
              Health Vitals Quick Check
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--muted-fg)" }}>Track BP, Glucose, and SpO2</span>
              <Button as="button" variant="outline" size="sm" onClick={() => navigate("/patient/vitals")}>
                Log Vitals
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
