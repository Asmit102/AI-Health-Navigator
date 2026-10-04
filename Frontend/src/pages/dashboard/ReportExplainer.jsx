import ReactMarkdown from "react-markdown";
import { useState, useEffect, useRef } from "react";
import { Upload, FileText, Sparkles } from "lucide-react";
import Button from "../../components/Button";
import { uploadReport, getMyReports } from "../../services/reportService";

export default function ReportExplainer() {
  const [reports, setReports] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const fetchReports = async () => {
    try {
      const res = await getMyReports();
      setReports(res.reports);
      if (res.reports.length > 0) {
        setSelectedId(res.reports[0]._id);
      }
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadReport(file);
      await fetchReports();
      setSelectedId(res.report._id);
    } catch (err) {
      console.error("Failed to upload report", err);
      alert("Failed to upload/explain this report. Please try a different PDF.");
    } finally {
      setUploading(false);
    }
  };

  const selected = reports.find((r) => r._id === selectedId);

  return (
    <div>
      <div className="report-header-row">
        <div>
          <div className="report-title">Medical Report Explainer</div>
          <div className="report-sub">Upload any report or prescription — get it in plain language.</div>
        </div>
        <Button as="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          <Upload size={16} /> {uploading ? "Uploading..." : "Upload report"}
        </Button>
      </div>

      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      <div
        className={`upload-zone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <div className="upload-icon-circle">
          <Upload size={22} />
        </div>
        <div className="upload-title">
          {uploading ? "Reading and explaining your report..." : "Drop a PDF of your report"}
        </div>
        <div className="upload-sub">CBC, discharge summaries, prescriptions — currently PDF only.</div>
        <button className="upload-choose-btn" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          Choose file
        </button>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted-fg)" }}>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p style={{ color: "var(--muted-fg)" }}>No reports uploaded yet. Upload one to get started.</p>
      ) : (
        <div className="report-grid">
          <div className="panel">
            <div className="explain-head">Recent reports</div>
            <div className="report-list">
              {reports.map((r) => (
                <div
                  key={r._id}
                  className={`report-item ${r._id === selectedId ? "active" : ""}`}
                  onClick={() => setSelectedId(r._id)}
                >
                  <div className="report-item-icon">
                    <FileText size={17} />
                  </div>
                  <div>
                    <div className="report-item-name">{r.fileName}</div>
                    <div className="report-item-date">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
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
            {selected && (
              <>
                <div className="explain-report-name">{selected.fileName}</div>
                <div className="explain-summary markdown-body">
                  <ReactMarkdown>{selected.explanation}</ReactMarkdown>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}