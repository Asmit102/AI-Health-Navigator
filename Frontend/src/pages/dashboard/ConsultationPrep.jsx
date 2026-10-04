import { useState, useEffect } from "react";
import { ClipboardList, CheckCircle2 } from "lucide-react";
import Button from "../../components/Button";
import { getPrepForAppointment, updatePrep } from "../../services/prepService";

export default function ConsultationPrep({ appointmentId }) {
  const [prep, setPrep] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!appointmentId) {
      setLoading(false);
      return;
    }

    const fetchPrep = async () => {
      try {
        const res = await getPrepForAppointment(appointmentId);
        setPrep(res.prep);
        setAppointment(res.appointment);
      } catch (err) {
        console.error("Failed to load consultation prep", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrep();
  }, [appointmentId]);

  const handleChange = (noteId, value) => {
    setPrep((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n._id === noteId ? { ...n, value } : n)),
    }));
  };

  const addNote = () => {
    setPrep((prev) => ({
      ...prev,
      notes: [...prev.notes, { _id: `temp-${Date.now()}`, question: "Additional note", value: "" }],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Strip temporary IDs before saving - MongoDB will assign real ones
      const cleanNotes = prep.notes.map(({ question, value }) => ({ question, value }));
      const res = await updatePrep(prep._id, cleanNotes);
      setPrep(res.prep);
    } catch (err) {
      console.error("Failed to save notes", err);
    } finally {
      setSaving(false);
    }
  };

  if (!appointmentId) {
    return (
      <p style={{ color: "var(--muted-fg)" }}>
        Go to Appointments and click "Prepare" on a specific appointment to get started.
      </p>
    );
  }

  if (loading) return <p style={{ color: "var(--muted-fg)" }}>Loading consultation prep...</p>;
  if (!prep || !appointment) return <p style={{ color: "var(--muted-fg)" }}>Could not load this consultation.</p>;

  return (
    <div>
      <div className="prep-header-row">
        <div className="prep-title">Consultation Preparation</div>
        <div className="prep-sub">Walk into your next visit with a clear, structured summary.</div>
      </div>

      <div className="panel">
        <div className="prep-panel-head">
          <span className="prep-doctor-line">
            {appointment.doctorName} — {new Date(appointment.date).toLocaleDateString()}, {appointment.time}
          </span>
          <span className="status-pill">{appointment.status}</span>
        </div>

        {prep.notes.map((f) => (
          <div key={f._id} className="prep-field">
            <div className="prep-question">{f.question}</div>
            <textarea
              className="prep-textarea"
              placeholder="Type your answer..."
              value={f.value}
              onChange={(e) => handleChange(f._id, e.target.value)}
              rows={2}
            />
          </div>
        ))}

        <button className="add-note-btn" onClick={addNote}>
          + Add another note
        </button>
      </div>

      <div className="panel questions-panel">
        <div className="questions-head">
          <ClipboardList size={17} />
          Suggested questions for your doctor
        </div>
        <div className="question-list">
          {prep.suggestedQuestions.map((q, i) => (
            <div key={i} className="question-item">
              <CheckCircle2 size={16} />
              {q}
            </div>
          ))}
        </div>
      </div>

      <div className="prep-footer-actions">
        <Button as="button" variant="outline">Download summary</Button>
        <Button as="button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save notes"}
        </Button>
      </div>
    </div>
  );
}