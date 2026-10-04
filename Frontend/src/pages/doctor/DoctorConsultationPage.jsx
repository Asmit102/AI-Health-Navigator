import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ClipboardPenLine,
  User,
  Sparkles,
  Pill,
  Trash2,
  Save,
  CheckCircle,
  FileText,
  Stethoscope,
} from "lucide-react";
import { getDoctorQueue, getPatientPrepSummary } from "../../services/doctorService";
import { createVisitRecord } from "../../services/visitService";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";

export default function DoctorConsultationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initialApptId = searchParams.get("id");

  const [queue, setQueue] = useState([]);
  const [selectedApptId, setSelectedApptId] = useState(initialApptId || "");
  const [patientData, setPatientData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Prescription Form
  const [form, setForm] = useState({
    diagnosis: "",
    clinicalNotes: "",
    patientAdvice: "",
    followUpDate: "",
    followUpNote: "",
  });

  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "Twice daily", timing: "After meals", duration: "5 days", instructions: "" },
  ]);

  // Load appointments
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await getDoctorQueue();
        const q = res.queue || [];
        setQueue(q);
        if (!selectedApptId && q.length > 0) {
          setSelectedApptId(q[0]._id);
        }
      } catch (err) {
        console.error("Failed to load doctor queue:", err);
      }
    };
    fetchQueue();
  }, []);

  // Load patient prep summary when selected
  useEffect(() => {
    if (!selectedApptId) return;

    const loadSummary = async () => {
      try {
        const res = await getPatientPrepSummary(selectedApptId);
        setPatientData(res);
        // Prefill initial diagnosis from reason if helpful
        if (res.appointment?.reason && !form.diagnosis) {
          setForm((prev) => ({
            ...prev,
            clinicalNotes: `Patient presents with: ${res.appointment.reason}`,
          }));
        }
      } catch (err) {
        console.error("Failed to load patient prep summary:", err);
      }
    };

    loadSummary();
  }, [selectedApptId]);

  const handleMedChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", frequency: "Once daily", timing: "After food", duration: "5 days", instructions: "" },
    ]);
  };

  const removeMedicineRow = (index) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSaveEncounter = async (e) => {
    e.preventDefault();
    if (!form.diagnosis.trim()) {
      setFeedback("Please enter a diagnosis or clinical assessment.");
      return;
    }

    setSaving(true);
    setFeedback("");
    try {
      const validMedicines = medicines.filter((m) => m.name.trim().length > 0);

      const payload = {
        appointmentId: selectedApptId,
        patientId: patientData?.appointment?.patient?._id,
        doctorName: user?.name ? (user.name.startsWith("Dr.") ? user.name : `Dr. ${user.name}`) : "Dr. Treating Physician",
        specialty: user?.specialty || "General Physician",
        diagnosis: form.diagnosis,
        clinicalNotes: form.clinicalNotes,
        patientAdvice: form.patientAdvice,
        medicines: validMedicines,
        followUpDate: form.followUpDate ? new Date(form.followUpDate) : undefined,
        followUpNote: form.followUpNote,
      };

      await createVisitRecord(payload);
      setFeedback("Prescription & Clinical Summary issued successfully! Patient record updated.");
      setTimeout(() => {
        navigate("/doctor/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Failed to save visit record:", err);
      setFeedback("Failed to save encounter record. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const appointment = patientData?.appointment;
  const prep = patientData?.prep;
  const reports = patientData?.reports || [];

  return (
    <div>
      <div className="doc-header-row">
        <div>
          <div className="doc-title">
            <ClipboardPenLine size={24} style={{ color: "#0284c7" }} /> Clinical Consultation Workbench
          </div>
          <div className="doc-sub">
            Review patient symptoms, pre-filled AI summaries, and issue digital prescriptions.
          </div>
        </div>
      </div>

      {feedback && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            marginBottom: 20,
            fontSize: 14,
            background: feedback.includes("Failed") ? "#fee2e2" : "#e6f7ee",
            color: feedback.includes("Failed") ? "#991b1b" : "#166534",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <CheckCircle size={16} />
          {feedback}
        </div>
      )}

      {/* Select Patient Appointment */}
      {queue.length > 0 && (
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
          <User size={18} color="#0284c7" />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)" }}>
            Select Patient Consultation:
          </span>
          <select
            value={selectedApptId}
            onChange={(e) => setSelectedApptId(e.target.value)}
            className="field-input"
            style={{ maxWidth: 460 }}
          >
            {queue.map((q) => (
              <option key={q._id} value={q._id}>
                {q.patient?.name || "Patient"} — {new Date(q.date).toLocaleDateString()} ({q.time}) · {q.reason || "Consultation"}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 20 }}>
        {/* Left Column: Patient Context & Prep */}
        <div>
          <div className="panel" style={{ marginBottom: 20 }}>
            <div className="panel-head">
              <span className="panel-title">
                <User size={16} /> Patient Information
              </span>
              <span className="status-pill">{appointment?.status || "In-Session"}</span>
            </div>

            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>
              {appointment?.patient?.name || "Patient Name"}
            </div>
            <div style={{ fontSize: 13, color: "var(--muted-fg)", marginBottom: 12 }}>
              {appointment?.patient?.email} · {appointment?.patient?.gender || "Gender unlisted"}
            </div>

            <div style={{ background: "var(--muted)", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              <strong>Chief Complaint:</strong> {appointment?.reason || "General health inquiry"}
            </div>

            {/* Pre-filled Consultation Prep Notes */}
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={15} color="var(--primary)" /> Patient-Prepared Summary
            </div>

            {prep?.notes && prep.notes.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {prep.notes.map((n, i) => (
                  <div key={i} style={{ borderLeft: "3px solid var(--primary)", paddingLeft: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-fg)" }}>
                      {n.question}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--fg)", marginTop: 2 }}>
                      {n.value || "— No notes provided"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "var(--muted-fg)" }}>
                No pre-visit notes submitted by patient yet.
              </p>
            )}

            {/* AI Suggested Inquiries */}
            {prep?.suggestedQuestions && prep.suggestedQuestions.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>
                  AI Suggested Clinical Inquiries:
                </div>
                <ul style={{ paddingLeft: 18, fontSize: 13, color: "var(--muted-fg)", listStyle: "disc" }}>
                  {prep.suggestedQuestions.map((q, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Patient Lab Reports */}
          {reports.length > 0 && (
            <div className="panel">
              <div className="panel-head">
                <span className="panel-title">
                  <FileText size={16} /> Recent Lab Reports ({reports.length})
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {reports.map((r) => (
                  <div key={r._id} style={{ padding: "8px 12px", background: "var(--muted)", borderRadius: 8, fontSize: 13 }}>
                    <div style={{ fontWeight: 600, color: "var(--fg)" }}>{r.fileName}</div>
                    <div style={{ fontSize: 11, color: "var(--muted-fg)" }}>
                      Uploaded on {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Doctor's Clinical Note & Prescription Authoring */}
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">
              <Stethoscope size={16} color="#0284c7" /> Issue Clinical Summary & Prescription
            </span>
          </div>

          <form onSubmit={handleSaveEncounter} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="field-group">
              <label className="field-label">Primary Diagnosis / Clinical Impression *</label>
              <input
                placeholder="e.g. Acute Upper Respiratory Tract Infection (Viral)"
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                required
                className="field-input"
                style={{ fontWeight: 600 }}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Clinical Observations & Physical Exam Notes</label>
              <textarea
                placeholder="Observed vitals, auscultation findings, throat examination..."
                value={form.clinicalNotes}
                onChange={(e) => setForm({ ...form, clinicalNotes: e.target.value })}
                className="field-input"
                rows={3}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Patient Advice & Lifestyle Instructions</label>
              <textarea
                placeholder="Hydration, dietary precautions, rest, warning signs to watch for..."
                value={form.patientAdvice}
                onChange={(e) => setForm({ ...form, patientAdvice: e.target.value })}
                className="field-input"
                rows={2}
              />
            </div>

            {/* Prescription Table */}
            <div style={{ marginTop: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>
                  <Pill size={15} style={{ verticalAlign: -2, marginRight: 6, color: "var(--primary)" }} />
                  Prescribed Medications
                </span>
                <button
                  type="button"
                  onClick={addMedicineRow}
                  style={{
                    background: "none",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--primary)",
                    cursor: "pointer",
                  }}
                >
                  + Add Medicine
                </button>
              </div>

              {medicines.map((med, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--muted)",
                    padding: "12px 14px",
                    borderRadius: 10,
                    marginBottom: 10,
                    position: "relative",
                  }}
                >
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicineRow(idx)}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                      }}
                      title="Remove medicine"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 10, marginBottom: 8 }}>
                    <input
                      placeholder="Medicine Name (e.g. Paracetamol)"
                      value={med.name}
                      onChange={(e) => handleMedChange(idx, "name", e.target.value)}
                      className="field-input"
                    />
                    <input
                      placeholder="Dosage (e.g. 500mg)"
                      value={med.dosage}
                      onChange={(e) => handleMedChange(idx, "dosage", e.target.value)}
                      className="field-input"
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <select
                      value={med.frequency}
                      onChange={(e) => handleMedChange(idx, "frequency", e.target.value)}
                      className="field-input"
                    >
                      <option value="Once daily">Once daily (OD)</option>
                      <option value="Twice daily">Twice daily (BD)</option>
                      <option value="Thrice daily">Thrice daily (TDS)</option>
                      <option value="As needed">As needed (SOS)</option>
                    </select>

                    <select
                      value={med.timing}
                      onChange={(e) => handleMedChange(idx, "timing", e.target.value)}
                      className="field-input"
                    >
                      <option value="After meals">After meals</option>
                      <option value="Before meals">Before meals</option>
                      <option value="At bedtime">At bedtime</option>
                      <option value="With water">With water</option>
                    </select>

                    <input
                      placeholder="Duration (5 days)"
                      value={med.duration}
                      onChange={(e) => handleMedChange(idx, "duration", e.target.value)}
                      className="field-input"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Follow-up Schedule */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field-group">
                <label className="field-label">Follow-up Consultation Date</label>
                <input
                  type="date"
                  value={form.followUpDate}
                  onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
                  className="field-input"
                />
              </div>
              <div className="field-group">
                <label className="field-label">Follow-up Instructions</label>
                <input
                  placeholder="e.g. Return sooner if fever persists past 3 days"
                  value={form.followUpNote}
                  onChange={(e) => setForm({ ...form, followUpNote: e.target.value })}
                  className="field-input"
                />
              </div>
            </div>

            <Button
              as="button"
              type="submit"
              size="lg"
              className="btn-block"
              disabled={saving}
            >
              <Save size={16} /> {saving ? "Issuing Prescription..." : "Save Encounter & Issue Prescription"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
