import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Upload, FileText, Sparkles, Printer, CheckCircle, AlertCircle } from "lucide-react";
import { uploadReport, getMyReports } from "../../services/reportService";
import Button from "../../components/Button";

export default function ReportExplainerPage() {
  const [reports, setReports] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const fetchReports = useCallback(async () => {
    try {
      const res = await getMyReports();
      const reportList = res.reports || [];
      setReports(reportList);
      if (reportList.length > 0 && !selectedId) {
        setSelectedId(reportList[0]._id);
      }
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setError("Please upload a PDF document (e.g. lab test, discharge summary, or prescription).");
      return;
    }

    setError("");
    setUploading(true);
    try {
      const res = await uploadReport(file);
      await fetchReports();
      if (res.report?._id) {
        setSelectedId(res.report._id);
      }
    } catch (err) {
      console.error("Failed to upload/explain report:", err);
      setError("Unable to parse text from this PDF. Please ensure it is a valid text-readable PDF.");
    } finally {
      setUploading(false);
    }
  };

  const selectedReport = reports.find((r) => r._id === selectedId) || reports[0];

  return (
    <div>
      <div className="report-header-row">
        <div>
          <div className="report-title">Medical Report Explainer</div>
          <div className="report-sub">
            Upload any lab report, diagnostic summary, or discharge paper — get it translated into plain language.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {selectedReport && (
            <Button as="button" variant="outline" onClick={() => window.print()}>
              <Printer size={15} /> Print Explanation
            </Button>
          )}
          <Button
            as="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload size={16} /> {uploading ? "Analyzing Document..." : "Upload Report PDF"}
          </Button>
        </div>
      </div>

      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: 10,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Drag and Drop Zone */}
      <div
        className={`upload-zone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
      >
        <div className="upload-icon-circle">
          <Upload size={22} />
        </div>
        <div className="upload-title">
          {uploading ? "Extracting medical terms and generating explanation..." : "Drop your medical report PDF here"}
        </div>
        <div className="upload-sub">
          Compatible with CBC blood tests, lipid panels, metabolic panels, ultrasound reports, and discharge notes.
        </div>
        <button
          className="upload-choose-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Processing..." : "Select PDF File"}
        </button>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted-fg)", marginTop: 24 }}>Loading medical reports...</p>
      ) : reports.length === 0 ? (
        <div className="panel" style={{ textAlign: "center", padding: "40px 20px", marginTop: 24 }}>
          <FileText size={36} color="var(--primary)" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ color: "var(--fg)", marginBottom: 6 }}>No Reports Uploaded Yet</h3>
          <p style={{ color: "var(--muted-fg)", maxWidth: 460, margin: "0 auto 16px", fontSize: 14 }}>
            Upload a sample laboratory or clinical report in PDF format to receive an AI-powered, plain-language breakdown of key biomarkers.
          </p>
          <Button as="button" onClick={() => fileInputRef.current?.click()}>
            <Upload size={15} /> Upload First PDF
          </Button>
        </div>
      ) : (
        <div className="report-grid">
          {/* List of Previous Reports */}
          <div className="panel">
            <div className="explain-head">Uploaded Reports ({reports.length})</div>
            <div className="report-list">
              {reports.map((r) => (
                <div
                  key={r._id}
                  className={`report-item ${r._id === selectedReport?._id ? "active" : ""}`}
                  onClick={() => setSelectedId(r._id)}
                >
                  <div className="report-item-icon">
                    <FileText size={17} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="report-item-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.fileName}
                    </div>
                    <div className="report-item-date">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="report-item-tag">
                    <CheckCircle size={11} style={{ marginRight: 3 }} /> Ready
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation View */}
          <div className="panel">
            <div className="explain-head">
              <Sparkles size={16} color="var(--primary)" /> Plain-Language Analysis
            </div>

            {selectedReport && (
              <>
                <div className="explain-report-name" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{selectedReport.fileName}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-fg)" }}>
                    Uploaded on {new Date(selectedReport.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="explain-summary markdown-body">
                  <ReactMarkdown>{selectedReport.explanation}</ReactMarkdown>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
