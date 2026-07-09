import { useState } from "react";
import { Upload, FileText, Sparkles } from "lucide-react";
import Button from "../../components/Button";

const reports = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    date: "May 30, 2026",
    summary:
      "Your overall blood counts look largely normal. Hemoglobin is on the lower side of normal (12.1 g/dL) which could suggest mild iron deficiency — worth mentioning to your doctor.",
    values: [
      { name: "Hemoglobin", amount: "12.1 g/dL", status: "low", label: "Slightly low" },
      { name: "WBC", amount: "7,200 /µL", status: "normal", label: "Normal" },
      { name: "Platelets", amount: "2.4 lakh /µL", status: "normal", label: "Normal" },
    ],
  },
  {
    id: 2,
    name: "Complete Blood Count (CBC) —",
    date: "May 28, 2026",
    summary:
      "Your overall blood counts look largely normal. Hemoglobin is on the lower side of normal (12.1 g/dL) which could suggest mild iron deficiency — worth mentioning to your doctor.",
    values: [
      { name: "Hemoglobin", amount: "12.1g/dL", status: "low", label: "Slightly low" },
      { name: "WBC", amount: "7,200 /µL", status: "normal", label: "Normal" },
      { name: "Platelets", amount: "2.4 lakh/µL", status: "normal", label: "Normal" },
    ],
  },
  {
    id: 3,
    name: "Thyroid Panel (TSH, T3, T4)",
    date: "April 12, 2026",
    summary:
      "Your thyroid levels are within the normal range. No signs of hypo- or hyperthyroidism based on this panel.",
    values: [
      { name: "TSH", amount: "2.8 mIU/L", status: "normal", label: "Normal" },
      { name: "T3", amount: "1.2 ng/mL", status: "normal", label: "Normal" },
      { name: "T4", amount: "8.1 µg/dL", status: "normal", label: "Normal" },
    ],
  },
];

export default function ReportExplainer() {
  const [selectedId, setSelectedId] = useState(reports[0].id);
  const [dragging, setDragging] = useState(false);

  const selected = reports.find((r) => r.id === selectedId);

  return (
    <div>
      <div className="report-header-row">
        <div>
          <div className="report-title">Medical Report Explainer</div>
          <div className="report-sub">Upload any report or prescription — get it in plain language.</div>
        </div>
        <Button as="button">
          <Upload size={16} /> Upload report
        </Button>
      </div>

      <div
        className={`upload-zone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); /* TODO: handle file */ }}
      >
        <div className="upload-icon-circle">
          <Upload size={22} />
        </div>
        <div className="upload-title">Drop a PDF or image of your report</div>
        <div className="upload-sub">CBC, X-rays, prescriptions, discharge summaries — anything.</div>
        <button className="upload-choose-btn">Choose file</button>
      </div>

      <div className="report-grid">
        <div className="panel">
          <div className="explain-head">Recent reports</div>
          <div className="report-list">
            {reports.map((r) => (
              <div
                key={r.id}
                className={`report-item ${r.id === selectedId ? "active" : ""}`}
                onClick={() => setSelectedId(r.id)}
              >
                <div className="report-item-icon">
                  <FileText size={17} />
                </div>
                <div>
                  <div className="report-item-name">{r.name}</div>
                  <div className="report-item-date">{r.date}</div>
                </div>
                <span className="report-item-tag">Explained</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="explain-head">
            <Sparkles size={16} color="var(--primary)" /> Plain-language explanation
          </div>
          <div className="explain-report-name">
            {selected.name} — {selected.date}
          </div>
          <p className="explain-summary">{selected.summary}</p>

          {selected.values.map((v) => (
            <div key={v.name} className="value-row">
              <span className="value-name">{v.name}</span>
              <span className="value-amount">{v.amount}</span>
              <span className={`value-status status-${v.status}`}>{v.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}