import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FileCheck2, FileText, Sparkles, Printer } from "lucide-react";
import { getAllPatientReports } from "../../services/doctorService";
import Button from "../../components/Button";

export default function DoctorReportsPage() {
  const [reports, setReports] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getAllPatientReports();
        const list = res.reports || [];
        setReports(list);
        if (list.length > 0) setSelectedId(list[0]._id);
      } catch (err) {
        console.error("Failed to load patient reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const defaultSampleReports = [
    {
      _id: "rep-demo-1",
      fileName: "Complete_Blood_Count_Ananya_Sharma.pdf",
      patient: { name: "Ananya Sharma", email: "ananya@example.com" },
      createdAt: "2026-09-18T09:30:00.000Z",
      explanation: `### 📋 Clinical Summary
- **Hemoglobin**: 13.5 g/dL (Normal reference range)
- **Total Leukocyte Count (WBC)**: 8,400 /mcL (Normal)
- **Platelet Count**: 260,000 /mcL (Normal)
- **RBC Count**: 4.6 million/mcL (Normal)

### 🔍 Clinical Interpretation
All primary cellular components and hematologic parameters are within expected healthy reference limits. No signs of acute bacterial leukocytosis or thrombocytopenia.`,
    },
  ];

  const displayReports = reports.length > 0 ? reports : defaultSampleReports;
  const selected = displayReports.find((r) => r._id === selectedId) || displayReports[0];

  const filteredReports = displayReports.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.fileName.toLowerCase().includes(s) ||
      (r.patient?.name && r.patient.name.toLowerCase().includes(s))
    );
  });

  return (
    <div>
      <div className="doc-header-row">
        <div>
          <div className="doc-title">
            <FileCheck2 size={24} style={{ color: "#0284c7" }} /> Patient Diagnostic Reports
          </div>
          <div className="doc-sub">
            Review patient-submitted laboratory panels, pathology summaries, and AI extractions.
          </div>
        </div>

        {selected && (
          <Button as="button" variant="outline" onClick={() => window.print()}>
            <Printer size={15} /> Print Clinical Summary
          </Button>
        )}
      </div>

      <div className="report-grid">
        {/* Report List */}
        <div className="panel">
          <div className="explain-head" style={{ marginBottom: 12 }}>
            Diagnostic Documents ({filteredReports.length})
          </div>

          <div style={{ marginBottom: 14 }}>
            <input
              placeholder="Search by file or patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field-input"
              style={{ fontSize: 13 }}
            />
          </div>

          {loading ? (
            <p style={{ color: "var(--muted-fg)" }}>Loading records...</p>
          ) : (
            <div className="report-list">
              {filteredReports.map((r) => (
                <div
                  key={r._id}
                  className={`report-item ${r._id === selected?._id ? "active" : ""}`}
                  onClick={() => setSelectedId(r._id)}
                >
                  <div className="report-item-icon" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                    <FileText size={17} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="report-item-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.fileName}
                    </div>
                    <div className="report-item-date">
                      {r.patient?.name ? `Patient: ${r.patient.name} · ` : ""}
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Report AI Explanation Detail */}
        <div className="panel">
          <div className="explain-head">
            <Sparkles size={16} color="#0284c7" /> Diagnostic Analysis & Extraction
          </div>

          {selected ? (
            <>
              <div
                style={{
                  background: "var(--muted)",
                  padding: "12px 16px",
                  borderRadius: 10,
                  marginBottom: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "var(--fg)" }}>{selected.fileName}</div>
                  <div style={{ fontSize: 12, color: "var(--muted-fg)", marginTop: 2 }}>
                    Patient: <strong>{selected.patient?.name || "Patient"}</strong> · Uploaded:{" "}
                    {new Date(selected.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="explain-summary markdown-body">
                <ReactMarkdown>{selected.explanation}</ReactMarkdown>
              </div>
            </>
          ) : (
            <p style={{ color: "var(--muted-fg)" }}>Select a report to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
