import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NotebookPen, CalendarClock, Pill, Printer, Stethoscope, Plus } from "lucide-react";
import { getMyVisitRecords } from "../../services/visitService";
import Button from "../../components/Button";

export default function VisitMemoryPage() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await getMyVisitRecords();
        setVisits(res.visits || []);
      } catch (err) {
        console.error("Failed to load visit memories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, []);

  const defaultSampleVisits = [
    {
      _id: "demo-1",
      doctorName: "Dr. Rakesh Mehta",
      specialty: "General Physician",
      date: "2026-09-20T09:30:00.000Z",
      followUpDate: "2026-09-25T09:30:00.000Z",
      diagnosis: "Viral Upper Respiratory Infection",
      clinicalNotes: "Mild fever (100.2 F), clear chest on auscultation, throat erythema noted. Hydration and symptomatic rest advised.",
      patientAdvice: "Drink plenty of warm fluids, steam inhalation twice daily, and monitor body temperature twice a day.",
      medicines: [
        { name: "Paracetamol", dosage: "500mg", frequency: "Every 6 hours as needed for fever", timing: "After meals" },
        { name: "Azithromycin", dosage: "250mg", frequency: "Once daily", timing: "After breakfast", duration: "5 days" },
        { name: "Cetirizine", dosage: "10mg", frequency: "Once daily", timing: "At bedtime", duration: "3 days" },
      ],
    },
  ];

  const displayVisits = visits.length > 0 ? visits : defaultSampleVisits;

  return (
    <div>
      <div className="memory-header-row">
        <div>
          <div className="memory-title">
            <NotebookPen size={22} /> Doctor Visit Memory & Prescriptions
          </div>
          <div className="memory-sub">
            Every clinical diagnosis, physician instruction, and prescription securely saved in one timeline.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Button as="button" variant="outline" onClick={() => window.print()}>
            <Printer size={15} /> Print Rx Summary
          </Button>
          <Button as="button" onClick={() => navigate("/patient/appointments")}>
            <Plus size={15} /> Schedule Consultation
          </Button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted-fg)" }}>Loading clinical visit history...</p>
      ) : (
        <div className="visit-list">
          {displayVisits.map((v) => (
            <div key={v._id} className="card visit-card" style={{ marginBottom: 20 }}>
              <div className="visit-card-head">
                <div>
                  <div className="visit-doctor-name" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Stethoscope size={18} color="var(--primary)" />
                    {v.doctorName}
                  </div>
                  <div className="visit-doctor-meta">
                    {v.specialty} · Consultation on {new Date(v.date).toLocaleDateString()}
                  </div>
                </div>

                {v.followUpDate && (
                  <span className="followup-pill">
                    <CalendarClock size={13} /> Follow-up: {new Date(v.followUpDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Diagnosis & Clinical Notes */}
              <div style={{ margin: "14px 0 10px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>
                  Diagnosis / Assessment:
                </div>
                <div style={{ fontSize: 14, color: "var(--fg)", fontWeight: 600 }}>
                  {v.diagnosis}
                </div>
              </div>

              {v.clinicalNotes && (
                <p className="visit-note" style={{ marginTop: 6, marginBottom: 12 }}>
                  <strong>Doctor's Notes:</strong> {v.clinicalNotes}
                </p>
              )}

              {v.patientAdvice && (
                <div style={{
                  background: "var(--primary-soft)",
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "var(--fg)",
                  marginBottom: 16
                }}>
                  <strong>Physician Advice:</strong> {v.patientAdvice}
                </div>
              )}

              {/* Prescribed Medications */}
              {v.medicines && v.medicines.length > 0 && (
                <>
                  <div className="visit-prescribed-label">Prescribed Medications & Regimen</div>
                  <div className="visit-med-list">
                    {v.medicines.map((m, idx) => (
                      <div key={idx} className="visit-med-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Pill size={15} color="var(--primary)" />
                          <div>
                            <span style={{ fontWeight: 700 }}>{m.name}</span>
                            {m.dosage && <span style={{ color: "var(--muted-fg)", marginLeft: 6 }}>({m.dosage})</span>}
                            <div style={{ fontSize: 12, color: "var(--muted-fg)", marginTop: 2 }}>
                              {m.frequency} · {m.timing} {m.duration ? `· Duration: ${m.duration}` : ""}
                            </div>
                          </div>
                        </div>
                        <span className="tag tag-taken" style={{ fontSize: 11 }}>Active</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
