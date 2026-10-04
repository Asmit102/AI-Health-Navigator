import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Users,
  FileText,
  CalendarClock,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { getDoctorQueue, getDoctorStats } from "../../services/doctorService";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [queue, setQueue] = useState([]);
  const [stats, setStats] = useState({
    todayPatients: 4,
    preFilledSummaries: 3,
    completedVisits: 1,
    followUpsDue: 2,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [queueRes, statsRes] = await Promise.allSettled([
          getDoctorQueue(),
          getDoctorStats(),
        ]);

        if (queueRes.status === "fulfilled") setQueue(queueRes.value.queue || []);
        if (statsRes.status === "fulfilled") setStats(statsRes.value.stats || stats);
      } catch (err) {
        console.error("Failed to load doctor dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const docName = user?.name
    ? user.name.startsWith("Dr.")
      ? user.name
      : `Dr. ${user.name}`
    : "Dr. Treating Physician";

  const statCards = [
    {
      icon: Users,
      value: stats.todayPatients || queue.length || 4,
      label: "Today's Patient Queue",
      bg: "#e0f2fe",
      fg: "#0284c7",
    },
    {
      icon: FileText,
      value: stats.preFilledSummaries || 3,
      label: "Pre-filled AI Summaries",
      bg: "#dff2f4",
      fg: "var(--primary)",
    },
    {
      icon: CheckCircle2,
      value: stats.completedVisits || 1,
      label: "Completed Consultations",
      bg: "#dcfce7",
      fg: "#16a34a",
    },
    {
      icon: CalendarClock,
      value: stats.followUpsDue || 2,
      label: "Follow-ups Due This Week",
      bg: "#fef3c7",
      fg: "#d97706",
    },
  ];

  const defaultSampleQueue = [
    {
      _id: "q-1",
      patient: { name: "Ananya Sharma", dateOfBirth: "1994-04-12" },
      doctorName: docName,
      specialty: user?.specialty || "General Physician",
      reason: "Persistent throbbing headache and mild fever — 4 days",
      time: "10:30 AM",
      status: "confirmed",
      hasPrep: true,
    },
    {
      _id: "q-2",
      patient: { name: "Rohit Verma", dateOfBirth: "1985-08-20" },
      doctorName: docName,
      specialty: user?.specialty || "General Physician",
      reason: "Follow-up: hypertension review and prescription refill",
      time: "11:15 AM",
      status: "in-progress",
      hasPrep: true,
    },
    {
      _id: "q-3",
      patient: { name: "Priya Mehta", dateOfBirth: "1998-02-14" },
      doctorName: docName,
      specialty: user?.specialty || "General Physician",
      reason: "Skin rash, acute contact allergy",
      time: "12:00 PM",
      status: "pending",
      hasPrep: false,
    },
  ];

  const displayQueue = queue.length > 0 ? queue : defaultSampleQueue;

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PT";

  return (
    <div>
      <div className="doc-header-row">
        <div>
          <div className="doc-title">
            <Stethoscope size={24} style={{ color: "#0284c7" }} /> Clinical Care Team Dashboard
          </div>
          <div className="doc-sub">
            Patient-prepared consultation summaries, clinical histories, and prescription authoring.
          </div>
        </div>
        <span className="doc-badge">
          {docName} · {user?.specialty || "General Physician"}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        {statCards.map((s) => (
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

      {/* Patient Queue Panel */}
      <div className="panel">
        <div className="panel-head">
          <span className="panel-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={16} /> Patient Consultation Queue
          </span>
          <Button
            as="button"
            size="sm"
            onClick={() => navigate("/doctor/consultations")}
          >
            + Write Consultation Note
          </Button>
        </div>

        {loading ? (
          <p style={{ color: "var(--muted-fg)", padding: "16px 0" }}>Loading queue...</p>
        ) : (
          <div className="queue-list">
            {displayQueue.map((item) => {
              const pName = item.patient?.name || "Patient";
              return (
                <div key={item._id} className="queue-item">
                  <div className="queue-avatar">{getInitials(pName)}</div>
                  <div className="queue-info">
                    <div className="queue-patient-name">
                      {pName}{" "}
                      {item.patient?.gender && (
                        <span style={{ fontWeight: 400, color: "var(--muted-fg)" }}>
                          · {item.patient.gender}
                        </span>
                      )}
                    </div>
                    <div className="queue-reason">
                      <strong>Reason:</strong> {item.reason || "General health consultation"}
                    </div>
                  </div>

                  <div className="queue-time">
                    <Clock size={12} style={{ verticalAlign: -1, marginRight: 3 }} />
                    {item.time || "Scheduled"}
                  </div>

                  <div>
                    {item.hasPrep ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          background: "#dff2f4",
                          color: "var(--primary)",
                          padding: "3px 10px",
                          borderRadius: 20,
                        }}
                      >
                        <Sparkles size={12} /> Prep Ready
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          background: "var(--muted)",
                          color: "var(--muted-fg)",
                          padding: "3px 10px",
                          borderRadius: 20,
                        }}
                      >
                        Waiting Prep
                      </span>
                    )}
                  </div>

                  <div className="queue-actions">
                    <Button
                      as="button"
                      size="sm"
                      onClick={() => navigate(`/doctor/consultations?id=${item._id}`)}
                    >
                      Open Clinical Summary
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
