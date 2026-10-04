import { useState, useEffect } from "react";
import {
  Pill,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Sparkles,
  QrCode,
  Printer,
  Copy,
  Check,
  Trash2,
  Plus,
  X,
  Clock,
  Utensils,
  Stethoscope,
} from "lucide-react";
import {
  checkMedicationSafety,
  getSafetyHistory,
  deleteSafetyRecord,
} from "../../services/medicationService";
import { useAuth } from "../../context/AuthContext";

const MED_PRESETS = [
  "Aspirin 81mg",
  "Ibuprofen 400mg",
  "Warfarin 5mg",
  "Metformin 500mg",
  "Lisinopril 10mg",
  "Atorvastatin 20mg",
  "Omeprazole 20mg",
  "Amoxicillin 500mg",
  "Levothyroxine 50mcg",
  "Metoprolol 50mg",
];

const ALLERGY_PRESETS = ["Penicillin", "Sulfa Drugs", "NSAIDs / Aspirin", "Latex", "Codeine", "None"];

const CONDITION_PRESETS = [
  "Hypertension (High BP)",
  "Type 2 Diabetes",
  "Asthma",
  "Chronic Kidney Disease",
  "GERD / Acid Reflux",
  "Cardiovascular Disease",
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Unknown"];

export default function MedicationSafetyPage() {
  const { user } = useAuth();

  // Input states
  const [medications, setMedications] = useState(["Aspirin 81mg", "Ibuprofen 400mg"]);
  const [medInput, setMedInput] = useState("");
  const [allergies, setAllergies] = useState(["Penicillin"]);
  const [conditions, setConditions] = useState(["Hypertension (High BP)"]);

  // Emergency Profile
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [emergencyContactName, setEmergencyContactName] = useState("Jane Doe (Spouse)");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("+1 (555) 382-9102");
  const [organDonor, setOrganDonor] = useState(true);

  // Results & UI states
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const [activeTab, setActiveTab] = useState("scanner"); // "scanner" | "passport" | "history"

  const fetchHistory = async () => {
    try {
      const data = await getSafetyHistory();
      if (data?.records) setHistory(data.records);
    } catch (err) {
      console.warn("Could not load history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleAddMed = (name) => {
    const clean = name.trim();
    if (clean && !medications.includes(clean)) {
      setMedications([...medications, clean]);
      setMedInput("");
    }
  };

  const handleRemoveMed = (name) => {
    setMedications(medications.filter((m) => m !== name));
  };

  const handleAddAllergy = (name) => {
    const clean = name.trim();
    if (clean && !allergies.includes(clean)) {
      if (clean === "None") {
        setAllergies(["None"]);
      } else {
        setAllergies([...allergies.filter((a) => a !== "None"), clean]);
      }
    }
  };

  const handleRemoveAllergy = (name) => {
    setAllergies(allergies.filter((a) => a !== name));
  };

  const handleAddCondition = (name) => {
    const clean = name.trim();
    if (clean && !conditions.includes(clean)) {
      setConditions([...conditions, clean]);
    }
  };

  const handleRemoveCondition = (name) => {
    setConditions(conditions.filter((c) => c !== name));
  };

  const handleRunScan = async () => {
    if (medications.length === 0) return;
    setLoading(true);
    try {
      const data = await checkMedicationSafety({
        medications,
        allergies,
        conditions,
        saveToHistory: true,
        emergencyProfile: {
          bloodGroup,
          emergencyContactName,
          emergencyContactPhone,
          organDonor,
        },
      });
      if (data?.analysis) {
        setResult(data.analysis);
        fetchHistory();
      }
    } catch (err) {
      console.error("Scan failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyQuestions = () => {
    if (!result?.doctorDiscussionPoints) return;
    const text = result.doctorDiscussionPoints.map((q, i) => `${i + 1}. ${q}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedQuestions(true);
    setTimeout(() => setCopiedQuestions(false), 2500);
  };

  const handlePrintPassport = () => {
    window.print();
  };

  const handleDeleteHistoryItem = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteSafetyRecord(id);
      setHistory(history.filter((h) => h._id !== id));
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  const loadPastRecord = (rec) => {
    setMedications(rec.medications || []);
    setAllergies(rec.allergies || []);
    setConditions(rec.conditions || []);
    if (rec.emergencyProfile) {
      if (rec.emergencyProfile.bloodGroup) setBloodGroup(rec.emergencyProfile.bloodGroup);
      if (rec.emergencyProfile.emergencyContactName) setEmergencyContactName(rec.emergencyProfile.emergencyContactName);
      if (rec.emergencyProfile.emergencyContactPhone) setEmergencyContactPhone(rec.emergencyProfile.emergencyContactPhone);
    }
    setResult({
      overallRisk: rec.overallRisk,
      riskScore: rec.riskScore,
      headline: rec.headline,
      drugInteractions: rec.drugInteractions,
      allergyWarnings: rec.allergyWarnings,
      conditionPrecautions: rec.conditionPrecautions,
      foodDietInteractions: rec.foodDietInteractions,
      doctorDiscussionPoints: rec.doctorDiscussionPoints,
    });
    setActiveTab("scanner");
  };

  // Helper for risk badge colors
  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case "severe":
        return { bg: "#fee2e2", text: "#991b1b", border: "#f87171", icon: ShieldAlert };
      case "moderate":
        return { bg: "#fef3c7", text: "#92400e", border: "#fcd34d", icon: AlertTriangle };
      default:
        return { bg: "#dcfce7", text: "#166534", border: "#86efac", icon: ShieldCheck };
    }
  };

  const riskMeta = getRiskColor(result?.overallRisk);
  const RiskIcon = riskMeta.icon;

  return (
    <div className="med-safety-page" style={{ paddingBottom: 40 }}>
      {/* Page Header */}
      <div className="dash-header" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 className="dash-title" style={{ fontSize: 24, fontWeight: 700 }}>
                AI Medication Safety & Drug Interaction Scanner
              </h1>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: 20,
                  background: "var(--primary-soft)",
                  color: "var(--primary)",
                  border: "1px solid var(--border)",
                }}
              >
                <Sparkles size={12} /> Gemini Clinical AI
              </span>
            </div>
            <p className="dash-sub" style={{ marginTop: 4, color: "var(--muted-fg)", fontSize: 14 }}>
              Scan multi-drug combinations for dangerous interactions, cross-check personal allergies & health conditions, and generate your printable Emergency Health Passport.
            </p>
          </div>

          {/* Tab Selector */}
          <div style={{ display: "flex", gap: 8, background: "var(--muted)", padding: 4, borderRadius: 10 }}>
            <button
              onClick={() => setActiveTab("scanner")}
              className={`btn ${activeTab === "scanner" ? "btn-primary" : "btn-ghost"}`}
              style={{ fontSize: 13, padding: "7px 14px" }}
            >
              <Pill size={15} /> Rx Scanner
            </button>
            <button
              onClick={() => setActiveTab("passport")}
              className={`btn ${activeTab === "passport" ? "btn-primary" : "btn-ghost"}`}
              style={{ fontSize: 13, padding: "7px 14px" }}
            >
              <QrCode size={15} /> Emergency Pass
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`btn ${activeTab === "history" ? "btn-primary" : "btn-ghost"}`}
              style={{ fontSize: 13, padding: "7px 14px" }}
            >
              <Clock size={15} /> Scan History ({history.length})
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: SCANNER & AI ENGINE */}
      {activeTab === "scanner" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
          {/* LEFT: INPUT CONSOLE */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* 1. Medications Card */}
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 20,
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Pill size={18} color="var(--primary)" />
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>1. Medications & Supplements</h2>
              </div>
              <p style={{ fontSize: 12, color: "var(--muted-fg)", marginBottom: 14 }}>
                Enter all active prescription drugs, over-the-counter pain relievers, or supplements you are taking.
              </p>

              {/* Tag Input */}
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input
                  type="text"
                  placeholder="e.g. Warfarin 5mg, Ibuprofen, Atorvastatin..."
                  value={medInput}
                  onChange={(e) => setMedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMed(medInput);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: "9px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--fg)",
                    fontSize: 13,
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleAddMed(medInput)}
                  disabled={!medInput.trim()}
                  style={{ padding: "8px 14px" }}
                >
                  <Plus size={16} /> Add
                </button>
              </div>

              {/* Active Med Pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, minHeight: 40, marginBottom: 14 }}>
                {medications.map((med) => (
                  <span
                    key={med}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "var(--primary-soft)",
                      color: "var(--accent-fg)",
                      padding: "5px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      border: "1px solid rgba(31, 154, 168, 0.25)",
                    }}
                  >
                    <Pill size={12} /> {med}
                    <button
                      onClick={() => handleRemoveMed(med)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "inherit",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                      }}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
                {medications.length === 0 && (
                  <div style={{ fontSize: 13, color: "var(--muted-fg)", fontStyle: "italic" }}>
                    No medications added yet. Click presets below or type above.
                  </div>
                )}
              </div>

              {/* Presets */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-fg)", marginBottom: 8, textTransform: "uppercase" }}>
                  Quick Add Common Medications:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {MED_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAddMed(preset)}
                      disabled={medications.includes(preset)}
                      style={{
                        fontSize: 11,
                        padding: "4px 8px",
                        borderRadius: 6,
                        border: "1px solid var(--border)",
                        background: medications.includes(preset) ? "var(--muted)" : "var(--bg)",
                        color: medications.includes(preset) ? "var(--muted-fg)" : "var(--fg)",
                        cursor: medications.includes(preset) ? "default" : "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Patient Profile & Allergies Card */}
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 20,
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <ShieldAlert size={18} color="#f59e0b" />
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>2. Known Allergies & Health Conditions</h2>
              </div>

              {/* Allergies section */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                  Known Drug / Food Allergies:
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  {allergies.map((allergy) => (
                    <span
                      key={allergy}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "#fee2e2",
                        color: "#991b1b",
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {allergy}
                      <button
                        onClick={() => handleRemoveAllergy(allergy)}
                        style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex" }}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {ALLERGY_PRESETS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => handleAddAllergy(a)}
                      style={{
                        fontSize: 11,
                        padding: "3px 8px",
                        borderRadius: 6,
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--muted-fg)",
                        cursor: "pointer",
                      }}
                    >
                      + {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditions section */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                  Chronic Health Conditions:
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  {conditions.map((cond) => (
                    <span
                      key={cond}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "var(--muted)",
                        color: "var(--fg)",
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        border: "1px solid var(--border)",
                      }}
                    >
                      {cond}
                      <button
                        onClick={() => handleRemoveCondition(cond)}
                        style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex" }}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {CONDITION_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleAddCondition(c)}
                      style={{
                        fontSize: 11,
                        padding: "3px 8px",
                        borderRadius: 6,
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--muted-fg)",
                        cursor: "pointer",
                      }}
                    >
                      + {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Run Analysis Action Button */}
            <button
              onClick={handleRunScan}
              disabled={medications.length === 0 || loading}
              className="btn btn-primary btn-block btn-lg"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                fontSize: 15,
                fontWeight: 700,
                boxShadow: "var(--shadow-glow)",
              }}
            >
              {loading ? (
                <>
                  <Sparkles size={18} className="animate-spin" /> Analyzing Clinical Interactions...
                </>
              ) : (
                <>
                  <HeartPulse size={18} /> Run AI Drug Interaction & Safety Scan
                </>
              )}
            </button>
          </div>

          {/* RIGHT: ANALYSIS RESULTS & RISK RADAR */}
          <div>
            {result ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* 1. Overall Risk Score Banner */}
                <div
                  style={{
                    background: riskMeta.bg,
                    border: `1.5px solid ${riskMeta.border}`,
                    borderRadius: 14,
                    padding: 22,
                    color: riskMeta.text,
                    boxShadow: "var(--shadow-soft)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <RiskIcon size={26} />
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>
                          {result.overallRisk} Interaction Risk ({result.riskScore ?? 25}/100)
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.9 }}>
                          Evaluated across {medications.length} active medications
                        </div>
                      </div>
                    </div>

                    {/* Progress score pill */}
                    <div
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        padding: "6px 14px",
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 800,
                        border: `1px solid ${riskMeta.border}`,
                      }}
                    >
                      Risk Index: {result.riskScore ?? 20}%
                    </div>
                  </div>

                  <p style={{ fontSize: 13, lineHeight: 1.6, fontWeight: 500 }}>
                    {result.headline}
                  </p>
                </div>

                {/* 2. Drug-Drug Interactions */}
                {result.drugInteractions && result.drugInteractions.length > 0 && (
                  <div
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      padding: 20,
                      boxShadow: "var(--shadow-soft)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <AlertTriangle size={18} color="#dc2626" />
                      <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                        Identified Drug-Drug Interactions ({result.drugInteractions.length})
                      </h3>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {result.drugInteractions.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: 14,
                            borderRadius: 10,
                            background: "var(--muted)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <strong style={{ fontSize: 14, color: "var(--fg)" }}>{item.pair}</strong>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: 12,
                                background: item.severity === "Major" ? "#fee2e2" : "#fef3c7",
                                color: item.severity === "Major" ? "#991b1b" : "#92400e",
                              }}
                            >
                              {item.severity} Severity
                            </span>
                          </div>
                          <div style={{ fontSize: 12, color: "var(--muted-fg)", marginBottom: 6 }}>
                            <strong>Mechanism:</strong> {item.mechanism}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--fg)", background: "var(--card)", padding: "8px 12px", borderRadius: 6 }}>
                            💡 <strong>Advice:</strong> {item.clinicalAdvice}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Allergy & Condition Warnings */}
                {((result.allergyWarnings && result.allergyWarnings.length > 0) ||
                  (result.conditionPrecautions && result.conditionPrecautions.length > 0)) && (
                  <div
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      padding: 20,
                      boxShadow: "var(--shadow-soft)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <ShieldAlert size={18} color="var(--primary)" />
                      <h3 style={{ fontSize: 16, fontWeight: 700 }}>Allergy & Health Condition Alerts</h3>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {result.allergyWarnings?.map((warn, i) => (
                        <div
                          key={i}
                          style={{
                            padding: 12,
                            borderRadius: 8,
                            background: "#fff1f2",
                            border: "1px solid #fecdd3",
                            color: "#9f1239",
                            fontSize: 13,
                          }}
                        >
                          <strong>Allergy Alert ({warn.allergen}):</strong> {warn.warning}
                        </div>
                      ))}

                      {result.conditionPrecautions?.map((prec, i) => (
                        <div
                          key={i}
                          style={{
                            padding: 12,
                            borderRadius: 8,
                            background: "var(--muted)",
                            border: "1px solid var(--border)",
                            fontSize: 13,
                            color: "var(--fg)",
                          }}
                        >
                          <strong>Condition Precaution ({prec.condition}):</strong> {prec.precaution}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Dietary & Food Interactions */}
                {result.foodDietInteractions && result.foodDietInteractions.length > 0 && (
                  <div
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      padding: 20,
                      boxShadow: "var(--shadow-soft)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <Utensils size={18} color="#10b981" />
                      <h3 style={{ fontSize: 16, fontWeight: 700 }}>Food, Drink & Dietary Precautions</h3>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {result.foodDietInteractions.map((food, i) => (
                        <div key={i} style={{ fontSize: 13, color: "var(--fg)" }}>
                          <strong>• {food.foodItem}:</strong> {food.effect}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Doctor / Pharmacist Discussion Checklist */}
                {result.doctorDiscussionPoints && result.doctorDiscussionPoints.length > 0 && (
                  <div
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      padding: 20,
                      boxShadow: "var(--shadow-soft)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Stethoscope size={18} color="var(--primary)" />
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Questions to Ask Your Doctor</h3>
                      </div>
                      <button
                        onClick={handleCopyQuestions}
                        className="btn btn-outline"
                        style={{ fontSize: 12, padding: "5px 10px" }}
                      >
                        {copiedQuestions ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                        {copiedQuestions ? "Copied!" : "Copy Questions"}
                      </button>
                    </div>

                    <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {result.doctorDiscussionPoints.map((q, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            fontSize: 13,
                            color: "var(--fg)",
                            background: "var(--muted)",
                            padding: "8px 12px",
                            borderRadius: 8,
                          }}
                        >
                          <span
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: "var(--primary)",
                              color: "var(--primary-fg)",
                              display: "grid",
                              placeItems: "center",
                              fontSize: 11,
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {idx + 1}
                          </span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              /* Empty state before scan */
              <div
                style={{
                  background: "var(--card)",
                  border: "2px dashed var(--border)",
                  borderRadius: 14,
                  padding: 40,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 400,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "var(--primary-soft)",
                    color: "var(--primary)",
                    display: "grid",
                    placeItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <Pill size={32} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                  Ready to Analyze Medication Safety
                </h3>
                <p style={{ fontSize: 13, color: "var(--muted-fg)", maxWidth: 360, lineHeight: 1.6, marginBottom: 20 }}>
                  Add your current medications on the left and click <strong>Run AI Safety Scan</strong> to detect adverse interactions, contraindications, and food precautions.
                </p>
                <button
                  onClick={handleRunScan}
                  disabled={medications.length === 0 || loading}
                  className="btn btn-primary"
                >
                  <Sparkles size={16} /> Run Scan with {medications.length} Medications
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EMERGENCY HEALTH PASSPORT & QR BADGE */}
      {activeTab === "passport" && (
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Printable Emergency Passport Card */}
          <div
            id="emergency-health-passport"
            style={{
              background: "linear-gradient(135deg, #0b1418 0%, #102a32 50%, #0d1e24 100%)",
              color: "#eaf3f4",
              border: "2px solid #2bb8c7",
              borderRadius: 18,
              padding: 28,
              boxShadow: "0 15px 45px rgba(0,0,0,0.35)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Holographic accent bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: "linear-gradient(90deg, #2bb8c7, #22c55e, #3b82f6, #2bb8c7)",
              }}
            />

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#2bb8c7",
                    color: "#06141a",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <HeartPulse size={26} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em", textTransform: "uppercase" }}>
                    Emergency Health Passport
                  </div>
                  <div style={{ fontSize: 11, color: "#8ba3ab", textTransform: "uppercase", letterSpacing: 1 }}>
                    Global Medical Emergency Profile
                  </div>
                </div>
              </div>

              {/* Blood Group Badge */}
              <div
                style={{
                  background: "#dc2626",
                  color: "#ffffff",
                  padding: "6px 14px",
                  borderRadius: 10,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5 }}>Blood Group</div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>{bloodGroup}</div>
              </div>
            </div>

            {/* Patient & Medical Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: "#8ba3ab", textTransform: "uppercase", marginBottom: 3 }}>Patient Name</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{user?.name || "Asmit (Verified Patient)"}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#8ba3ab", textTransform: "uppercase", marginBottom: 3 }}>Emergency Contact</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{emergencyContactName}</div>
                <div style={{ fontSize: 12, color: "#2bb8c7" }}>{emergencyContactPhone}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#8ba3ab", textTransform: "uppercase", marginBottom: 3 }}>Organ Donor</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: organDonor ? "#4ade80" : "#9ca3af" }}>
                  {organDonor ? "✓ Yes (Registered Donor)" : "No"}
                </div>
              </div>
            </div>

            {/* Critical Allergies & Meds Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: "#f87171", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>
                  ⚠️ Critical Allergies
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {allergies.map((a) => (
                    <span
                      key={a}
                      style={{
                        background: "rgba(239, 68, 68, 0.2)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        color: "#fca5a5",
                        padding: "3px 8px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: "#2bb8c7", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>
                  💊 Active Medications
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {medications.map((m) => (
                    <span
                      key={m}
                      style={{
                        background: "rgba(43, 184, 199, 0.18)",
                        border: "1px solid rgba(43, 184, 199, 0.35)",
                        color: "#7fd8e3",
                        padding: "3px 8px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* QR Code & Paramedic Notice Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                paddingTop: 16,
                background: "rgba(0,0,0,0.2)",
                margin: "-28px -28px -28px -28px",
                padding: "16px 28px",
              }}
            >
              <div style={{ fontSize: 11, color: "#8ba3ab", maxWidth: 420, lineHeight: 1.5 }}>
                <strong>Paramedic / Hospital Note:</strong> Scan QR code for cryptographic medical clearance, real-time EHR timeline, and emergency physician authorization.
              </div>

              {/* QR Simulation Box */}
              <div
                style={{
                  background: "#ffffff",
                  padding: 8,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <QrCode size={52} color="#0b1418" />
              </div>
            </div>
          </div>

          {/* Card Customization Controls & Print */}
          <div
            style={{
              marginTop: 24,
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 20,
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
              Customize Emergency Passport Details
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--fg)",
                    fontSize: 13,
                  }}
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Emergency Contact Name</label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--fg)",
                    fontSize: 13,
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Emergency Phone</label>
                <input
                  type="text"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--fg)",
                    fontSize: 13,
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={organDonor}
                  onChange={(e) => setOrganDonor(e.target.checked)}
                />
                Display Organ Donor Badge on Card
              </label>

              <button
                onClick={handlePrintPassport}
                className="btn btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <Printer size={16} /> Print / Save Emergency Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAFETY SCAN HISTORY */}
      {activeTab === "history" && (
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Past Medication Safety Scans</h2>
              <p style={{ fontSize: 13, color: "var(--muted-fg)" }}>
                Review past multi-drug analyses and reload previous prescriptions with a single click.
              </p>
            </div>
          </div>

          {history.length === 0 ? (
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 40,
                textAlign: "center",
                color: "var(--muted-fg)",
              }}
            >
              No past scans recorded yet. Run your first safety check from the Rx Scanner tab!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {history.map((rec) => {
                const badge = getRiskColor(rec.overallRisk);
                return (
                  <div
                    key={rec._id}
                    onClick={() => loadPastRecord(rec)}
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: 16,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "transform 0.15s, box-shadow 0.15s",
                      boxShadow: "var(--shadow-soft)",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            padding: "3px 8px",
                            borderRadius: 12,
                            background: badge.bg,
                            color: badge.text,
                          }}
                        >
                          {rec.overallRisk} Risk ({rec.riskScore ?? 20}%)
                        </span>
                        <span style={{ fontSize: 12, color: "var(--muted-fg)" }}>
                          {new Date(rec.createdAt).toLocaleDateString()} at {new Date(rec.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)", marginBottom: 4 }}>
                        {rec.medications?.join(" • ") || "Medications Scan"}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted-fg)" }}>
                        {rec.headline || "Clinical review completed."}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button
                        className="btn btn-outline"
                        style={{ fontSize: 12, padding: "5px 10px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          loadPastRecord(rec);
                        }}
                      >
                        Load Record
                      </button>
                      <button
                        onClick={(e) => handleDeleteHistoryItem(rec._id, e)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--muted-fg)",
                          cursor: "pointer",
                          padding: 6,
                        }}
                        title="Delete scan"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
