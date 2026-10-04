import { useState, useEffect, useCallback } from "react";
import {
  Activity,
  Heart,
  Droplets,
  Wind,
  Plus,
  Trash2,
  Printer,
} from "lucide-react";
import { getMyVitals, logVital, deleteVital } from "../../services/vitalService";
import Button from "../../components/Button";

export default function VitalsTrackerPage() {
  const [vitals, setVitals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [form, setForm] = useState({
    bloodPressureSys: "",
    bloodPressureDia: "",
    heartRate: "",
    bloodGlucose: "",
    temperature: "",
    spO2: "",
    symptoms: "",
    notes: "",
  });

  const fetchVitals = useCallback(async () => {
    try {
      const res = await getMyVitals();
      setVitals(res.vitals || []);
    } catch (err) {
      console.error("Failed to load vitals:", err);
    }
  }, []);

  useEffect(() => {
    fetchVitals();
  }, [fetchVitals]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback("");
    try {
      const payload = {
        bloodPressureSys: form.bloodPressureSys ? Number(form.bloodPressureSys) : undefined,
        bloodPressureDia: form.bloodPressureDia ? Number(form.bloodPressureDia) : undefined,
        heartRate: form.heartRate ? Number(form.heartRate) : undefined,
        bloodGlucose: form.bloodGlucose ? Number(form.bloodGlucose) : undefined,
        temperature: form.temperature ? Number(form.temperature) : undefined,
        spO2: form.spO2 ? Number(form.spO2) : undefined,
        symptoms: form.symptoms ? form.symptoms.split(",").map((s) => s.trim()) : [],
        notes: form.notes,
      };

      await logVital(payload);
      setForm({
        bloodPressureSys: "",
        bloodPressureDia: "",
        heartRate: "",
        bloodGlucose: "",
        temperature: "",
        spO2: "",
        symptoms: "",
        notes: "",
      });
      setShowModal(false);
      setFeedback("Vitals recorded successfully!");
      fetchVitals();
      setTimeout(() => setFeedback(""), 3500);
    } catch (err) {
      console.error("Failed to save vitals:", err);
      setFeedback("Failed to save vitals. Please check values.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVital(id);
      fetchVitals();
    } catch (err) {
      console.error("Failed to delete vital:", err);
    }
  };

  const latest = vitals[0] || {
    bloodPressureSys: 120,
    bloodPressureDia: 80,
    heartRate: 72,
    bloodGlucose: 95,
    temperature: 98.6,
    spO2: 98,
  };

  const getBpStatus = (sys, dia) => {
    if (!sys || !dia) return { label: "Standard", color: "var(--primary)" };
    if (sys < 120 && dia < 80) return { label: "Optimal", color: "#16a34a" };
    if (sys <= 129 && dia < 80) return { label: "Elevated", color: "#d97706" };
    return { label: "High / Review", color: "#dc2626" };
  };

  const bpStatus = getBpStatus(latest.bloodPressureSys, latest.bloodPressureDia);

  return (
    <div>
      <div className="dash-header-row">
        <div>
          <div className="dash-greeting" style={{ fontSize: 24, fontWeight: 800 }}>
            <Activity size={24} style={{ verticalAlign: -3, color: "var(--primary)" }} /> Health
            Vitals & Symptom Log
          </div>
          <div style={{ color: "var(--muted-fg)", fontSize: 14, marginTop: 4 }}>
            Monitor blood pressure, blood glucose, oxygen saturation, and symptoms over time.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Button as="button" variant="outline" onClick={() => window.print()}>
            <Printer size={15} /> Print Vitals Sheet
          </Button>
          <Button as="button" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Log New Reading
          </Button>
        </div>
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

      {/* Metric Cards Grid */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fee2e2", color: "#dc2626" }}>
            <Heart size={18} />
          </div>
          <div>
            <div className="stat-value">
              {latest.bloodPressureSys && latest.bloodPressureDia
                ? `${latest.bloodPressureSys}/${latest.bloodPressureDia}`
                : "120/80"}{" "}
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted-fg)" }}>mmHg</span>
            </div>
            <div className="stat-label">Blood Pressure · {bpStatus.label}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e0f2fe", color: "#0284c7" }}>
            <Activity size={18} />
          </div>
          <div>
            <div className="stat-value">
              {latest.heartRate || 72}{" "}
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted-fg)" }}>bpm</span>
            </div>
            <div className="stat-label">Heart Rate (Pulse)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
            <Droplets size={18} />
          </div>
          <div>
            <div className="stat-value">
              {latest.bloodGlucose || 95}{" "}
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted-fg)" }}>mg/dL</span>
            </div>
            <div className="stat-label">Blood Glucose (Fasting)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
            <Wind size={18} />
          </div>
          <div>
            <div className="stat-value">
              {latest.spO2 || 98}{" "}
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted-fg)" }}>%</span>
            </div>
            <div className="stat-label">Oxygen Saturation (SpO2)</div>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
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
            }}
          >
            <h3 style={{ marginBottom: 4, color: "var(--fg)" }}>Log Health Vitals</h3>
            <p style={{ fontSize: 13, color: "var(--muted-fg)", marginBottom: 18 }}>
              Enter current readings from your monitor or symptoms.
            </p>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field-group">
                  <label className="field-label">BP Systolic (top)</label>
                  <input
                    name="bloodPressureSys"
                    type="number"
                    placeholder="e.g. 120"
                    value={form.bloodPressureSys}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">BP Diastolic (bottom)</label>
                  <input
                    name="bloodPressureDia"
                    type="number"
                    placeholder="e.g. 80"
                    value={form.bloodPressureDia}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field-group">
                  <label className="field-label">Heart Rate (bpm)</label>
                  <input
                    name="heartRate"
                    type="number"
                    placeholder="e.g. 72"
                    value={form.heartRate}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Blood Glucose (mg/dL)</label>
                  <input
                    name="bloodGlucose"
                    type="number"
                    placeholder="e.g. 95"
                    value={form.bloodGlucose}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field-group">
                  <label className="field-label">SpO2 Oxygen (%)</label>
                  <input
                    name="spO2"
                    type="number"
                    placeholder="e.g. 98"
                    value={form.spO2}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Temperature (°F)</label>
                  <input
                    name="temperature"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 98.6"
                    value={form.temperature}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Symptoms (comma-separated)</label>
                <input
                  name="symptoms"
                  placeholder="e.g. Mild headache, fatigue, dizziness"
                  value={form.symptoms}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>

              <div className="field-group">
                <label className="field-label">Notes</label>
                <input
                  name="notes"
                  placeholder="e.g. Taken before breakfast, after 10 min rest"
                  value={form.notes}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <Button
                  as="button"
                  variant="outline"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button as="button" type="submit" disabled={submitting} className="btn-block">
                  {submitting ? "Saving..." : "Save Reading"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vitals History Log */}
      <div className="panel">
        <div className="panel-head">
          <span className="panel-title">Recorded Vitals History ({vitals.length})</span>
        </div>

        {vitals.length === 0 ? (
          <p style={{ color: "var(--muted-fg)", padding: "16px 0" }}>
            No vitals entries logged yet. Click "Log New Reading" to start tracking.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, color: "var(--fg)" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                  <th style={{ padding: "10px 12px", color: "var(--muted-fg)" }}>Date & Time</th>
                  <th style={{ padding: "10px 12px", color: "var(--muted-fg)" }}>Blood Pressure</th>
                  <th style={{ padding: "10px 12px", color: "var(--muted-fg)" }}>Heart Rate</th>
                  <th style={{ padding: "10px 12px", color: "var(--muted-fg)" }}>Glucose</th>
                  <th style={{ padding: "10px 12px", color: "var(--muted-fg)" }}>SpO2</th>
                  <th style={{ padding: "10px 12px", color: "var(--muted-fg)" }}>Symptoms</th>
                  <th style={{ padding: "10px 12px", color: "var(--muted-fg)" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {vitals.map((v) => (
                  <tr key={v._id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px" }}>{new Date(v.date).toLocaleString()}</td>
                    <td style={{ padding: "12px", fontWeight: 600 }}>
                      {v.bloodPressureSys && v.bloodPressureDia
                        ? `${v.bloodPressureSys}/${v.bloodPressureDia} mmHg`
                        : "—"}
                    </td>
                    <td style={{ padding: "12px" }}>{v.heartRate ? `${v.heartRate} bpm` : "—"}</td>
                    <td style={{ padding: "12px" }}>{v.bloodGlucose ? `${v.bloodGlucose} mg/dL` : "—"}</td>
                    <td style={{ padding: "12px" }}>{v.spO2 ? `${v.spO2}%` : "—"}</td>
                    <td style={{ padding: "12px" }}>
                      {v.symptoms?.length ? (
                        <span style={{ color: "var(--primary)", fontWeight: 500 }}>
                          {v.symptoms.join(", ")}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => handleDelete(v._id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--muted-fg)",
                          cursor: "pointer",
                        }}
                        title="Delete record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
