import { useState, useEffect } from "react";
import { Activity, FileText, Stethoscope, Pill } from "lucide-react";
import { getTimeline } from "../../services/timelineService";

const iconMap = {
  symptom: Activity,
  report: FileText,
  visit: Stethoscope,
  rx: Pill,
};

export default function HealthTimeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await getTimeline();
        setEvents(res.timeline);
      } catch (err) {
        console.error("Failed to load timeline", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  if (loading) return <p style={{ color: "var(--muted-fg)" }}>Loading timeline...</p>;

  return (
    <div>
      <div className="timeline-header-row">
        <div className="timeline-page-title">Health Journey Timeline</div>
        <div className="timeline-page-sub">Symptoms, reports, medicines and consultations over time.</div>
      </div>

      <div className="panel">
        <div className="timeline-panel-title">Recent activity</div>

        {events.length === 0 ? (
          <p style={{ color: "var(--muted-fg)" }}>No activity yet — book an appointment or upload a report to get started.</p>
        ) : (
          <div className="tl-list">
            {events.map((e, i) => {
              const Icon = iconMap[e.type] || Activity;
              return (
                <div key={i} className="tl-item">
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