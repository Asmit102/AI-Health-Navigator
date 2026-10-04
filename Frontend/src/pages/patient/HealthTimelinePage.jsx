import { useState, useEffect } from "react";
import { Activity, FileText, Stethoscope, Pill } from "lucide-react";
import { getTimeline } from "../../services/timelineService";

const iconMap = {
  symptom: Activity,
  report: FileText,
  visit: Stethoscope,
  rx: Pill,
};

export default function HealthTimelinePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await getTimeline();
        setEvents(res.timeline || []);
      } catch (err) {
        console.error("Failed to load timeline:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  const defaultSampleEvents = [
    {
      type: "visit",
      title: "Consultation with Dr. Rakesh Mehta",
      description: "General Physician — Follow-up review (completed)",
      date: "2026-09-18T09:30:00.000Z",
    },
    {
      type: "report",
      title: "Report Uploaded: Complete Blood Count (CBC)",
      description: "AI plain-language explanation generated",
      date: "2026-09-17T09:30:00.000Z",
    },
    {
      type: "rx",
      title: "Visit Summary & Prescription — Dr. Mehta",
      description: "Diagnosis: Viral Upper Respiratory Infection (3 medicines prescribed)",
      date: "2026-09-15T09:30:00.000Z",
    },
    {
      type: "symptom",
      title: "Health Vitals Logged",
      description: "BP 120/80 · Pulse 72 bpm · SpO2 98%",
      date: "2026-09-13T09:30:00.000Z",
    },
  ];

  const displayEvents = events.length > 0 ? events : defaultSampleEvents;

  const filteredEvents = displayEvents.filter((e) => {
    if (filter === "all") return true;
    return e.type === filter;
  });

  return (
    <div>
      <div className="timeline-header-row">
        <div>
          <div className="timeline-page-title">Health Journey Timeline</div>
          <div className="timeline-page-sub">
            Chronological log of appointments, medical reports, prescriptions, and health vitals.
          </div>
        </div>

        {/* Filter Badges */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            { id: "all", label: "All Events" },
            { id: "visit", label: "Visits" },
            { id: "report", label: "Lab Reports" },
            { id: "rx", label: "Prescriptions" },
            { id: "symptom", label: "Vitals & Symptoms" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid var(--border)",
                background: filter === tab.id ? "var(--primary)" : "var(--card)",
                color: filter === tab.id ? "var(--primary-fg)" : "var(--muted-fg)",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="timeline-panel-title">
          Timeline Log ({filteredEvents.length} events)
        </div>

        {loading ? (
          <p style={{ color: "var(--muted-fg)" }}>Loading health timeline...</p>
        ) : filteredEvents.length === 0 ? (
          <p style={{ color: "var(--muted-fg)", padding: "16px 0" }}>
            No health events found in this filter view.
          </p>
        ) : (
          <div className="tl-list">
            {filteredEvents.map((e, i) => {
              const Icon = iconMap[e.type] || Activity;
              return (
                <div key={e.id || i} className="tl-item">
                  <div className="tl-icon-col">
                    <div className={`tl-icon ${e.type}`}>
                      <Icon size={15} />
                    </div>
                    <div className="tl-line" />
                  </div>
                  <div className="tl-content">
                    <div className="tl-title-row">
                      <span className="tl-event-title">{e.title}</span>
                      <span className="tl-tag" style={{ textTransform: "capitalize" }}>
                        {e.category || e.type}
                      </span>
                    </div>
                    <div className="tl-date">{new Date(e.date).toLocaleDateString()}</div>
                    <div className="tl-desc">{e.description}</div>
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
