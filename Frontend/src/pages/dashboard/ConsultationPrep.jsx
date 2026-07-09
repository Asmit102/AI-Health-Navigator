import { useState } from "react";
import { ClipboardList, CheckCircle2 } from "lucide-react";
import Button from "../../components/Button";

const initialFields = [
  { id: 1, question: "What's the main reason for this visit?", value: "Persistent headache and fatigue for the last 5 days." },
  { id: 2, question: "When did symptoms start and how have they changed?", value: "Started Monday morning. Worse on day 3, slightly better today." },
  { id: 3, question: "Current medications you're taking?", value: "Paracetamol as needed, Vitamin D3 daily, Cetirizine at night." },
  { id: 4, question: "Any recent changes (travel, diet, stress)?", value: "" },
];

const suggestedQuestions = [
  "Could this be related to my recent travel or change in sleep?",
  "Do you recommend any blood tests (CBC, dengue panel)?",
  "Are there interactions between Cetirizine and my new prescription?",
  "What warning signs should bring me back sooner?",
];

export default function ConsultationPrep() {
  const [fields, setFields] = useState(initialFields);

  const handleChange = (id, value) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  };

  const addNote = () => {
    setFields((prev) => [
      ...prev,
      { id: Date.now(), question: "Additional note", value: "" },
    ]);
  };

  return (
    <div>
      <div className="prep-header-row">
        <div className="prep-title">Consultation Preparation</div>
        <div className="prep-sub">Walk into your next visit with a clear, structured summary.</div>
      </div>

      <div className="panel">
        <div className="prep-panel-head">
          <span className="prep-doctor-line">Dr. Rakesh Mehta — Tomorrow, 10:30 AM</span>
          <span className="status-pill">In progress</span>
        </div>

        {fields.map((f) => (
          <div key={f.id} className="prep-field">
            <div className="prep-question">{f.question}</div>
            <textarea
              className="prep-textarea"
              placeholder="Type your answer..."
              value={f.value}
              onChange={(e) => handleChange(f.id, e.target.value)}
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
          {suggestedQuestions.map((q) => (
            <div key={q} className="question-item">
              <CheckCircle2 size={16} />
              {q}
            </div>
          ))}
        </div>
      </div>

      <div className="prep-footer-actions">
        <Button as="button" variant="outline">Download summary</Button>
        <Button as="button">Share with doctor</Button>
      </div>
    </div>
  );
}