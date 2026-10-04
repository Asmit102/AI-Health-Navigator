import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ClipboardList, CheckCircle2, Save, Printer, Calendar, Plus } from "lucide-react";
import { getMyAppointments } from "../../services/appointmentService";
import { getPrepForAppointment, updatePrep } from "../../services/prepService";
import Button from "../../components/Button";

export default function ConsultationPrepPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialApptId = searchParams.get("id");

  const [appointments, setAppointments] = useState([]);
  const [selectedApptId, setSelectedApptId] = useState(initialApptId || "");
  const [prep, setPrep] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Load appointments
  useEffect(() => {
    const fetchAppts = async () => {
      try {
        const res = await getMyAppointments();
        const appts = res.appointments || [];
        setAppointments(appts);
        if (!selectedApptId && appts.length > 0) {
          setSelectedApptId(appts[0]._id);
        }
      } catch (err) {
        console.error("Error loading appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppts();
  }, []);

  // Load prep for selected appointment
  useEffect(() => {
    if (!selectedApptId) return;

    const loadPrep = async () => {
      setLoading(true);
      try {
        const res = await getPrepForAppointment(selectedApptId);
        setPrep(res.prep);
        setAppointment(res.appointment);
      } catch (err) {
        console.error("Error loading prep:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPrep();
  }, [selectedApptId]);

  const handleNoteChange = (noteIndex, value) => {
    setPrep((prev) => {
      const updatedNotes = [...prev.notes];
      updatedNotes[noteIndex] = { ...updatedNotes[noteIndex], value };
      return { ...prev, notes: updatedNotes };
    });
  };

  const addCustomQuestion = () => {
    const promptText = window.prompt("Enter your custom note or question for the doctor:");
    if (!promptText) return;
    setPrep((prev) => ({
      ...prev,
      notes: [...prev.notes, { question: promptText, value: "" }],
    }));
  };

  const handleSave = async () => {
    if (!prep?._id) return;
    setSaving(true);
    setSaveMessage("");
    try {
      const cleanNotes = prep.notes.map(({ question, value }) => ({ question, value }));
      const res = await updatePrep(prep._id, cleanNotes);
      setPrep(res.prep);
      setSaveMessage("Consultation notes saved successfully!");
      setTimeout(() => setSaveMessage(""), 3500);
    } catch (err) {
      console.error("Failed to save notes:", err);
      setSaveMessage("Failed to save notes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="prep-header-row">
        <div>
          <div className="prep-title">Consultation Preparation Sheet</div>
          <div className="prep-sub">
            Organize symptoms, medications, and questions before your doctor appointment.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Button as="button" variant="outline" onClick={handlePrint}>
            <Printer size={15} /> Print Summary
          </Button>
          <Button as="button" onClick={handleSave} disabled={saving || !prep}>
            <Save size={15} /> {saving ? "Saving..." : "Save Notes"}
          </Button>
        </div>
      </div>

      {saveMessage && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
            background: saveMessage.includes("success") ? "#e6f7ee" : "#fee2e2",
            color: saveMessage.includes("success") ? "#166534" : "#991b1b",
          }}
        >
          {saveMessage}
        </div>
      )}

      {/* Appointment Picker if multiple */}
      {appointments.length > 1 && (
        <div
          style={{
            background: "var(--card)",
            padding: "14px 18px",
            borderRadius: 12,
            border: "1px solid var(--border)",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Calendar size={18} color="var(--primary)" />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)" }}>
            Select Appointment:
          </span>
          <select
            value={selectedApptId}
            onChange={(e) => setSelectedApptId(e.target.value)}
            className="field-input"
            style={{ maxWidth: 380 }}
          >
            {appointments.map((a) => (
              <option key={a._id} value={a._id}>
                {a.doctorName} ({a.specialty}) — {new Date(a.date).toLocaleDateString()} at {a.time}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--muted-fg)" }}>Loading consultation preparation...</p>
      ) : !appointment ? (
        <div className="panel" style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ color: "var(--muted-fg)", marginBottom: 16 }}>
            No upcoming appointments found to prepare for.
          </p>
          <Button as="button" onClick={() => navigate("/patient/appointments")}>
            <Plus size={15} /> Book an appointment first
          </Button>
        </div>
      ) : (
        <div className="printable-prep-area">
          <div className="panel">
            <div className="prep-panel-head">
              <span className="prep-doctor-line">
                {appointment.doctorName} — {appointment.specialty}
              </span>
              <span className="status-pill">
                {new Date(appointment.date).toLocaleDateString()} · {appointment.time}
              </span>
            </div>

            {prep?.notes?.map((field, idx) => (
              <div key={idx} className="prep-field">
                <div className="prep-question">{field.question}</div>
                <textarea
                  className="prep-textarea"
                  placeholder="Type your notes or observations here..."
                  value={field.value || ""}
                  onChange={(e) => handleNoteChange(idx, e.target.value)}
                  rows={2}
                />
              </div>
            ))}

            <button className="add-note-btn" onClick={addCustomQuestion}>
              + Add another question or symptom note
            </button>
          </div>

          {prep?.suggestedQuestions && prep.suggestedQuestions.length > 0 && (
            <div className="panel questions-panel" style={{ marginTop: 20 }}>
              <div className="questions-head">
                <ClipboardList size={17} />
                AI-Suggested Questions For {appointment.specialty || "Doctor"}
              </div>
              <div className="question-list">
                {prep.suggestedQuestions.map((q, i) => (
                  <div key={i} className="question-item">
                    <CheckCircle2 size={16} color="var(--primary)" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
