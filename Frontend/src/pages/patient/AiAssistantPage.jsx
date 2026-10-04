import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User, Languages, AlertTriangle, Sparkles, Send, Trash2 } from "lucide-react";
import { askAssistant } from "../../services/aiService";
import { useAuth } from "../../context/AuthContext";

const quickPrompts = [
  "I have had a throbbing headache and mild fever for 3 days",
  "How should I prepare for a Cardiology consultation?",
  "What are the typical normal reference ranges for a CBC blood test?",
  "What questions should I ask my doctor about high blood pressure?",
];

export default function AiAssistantPage() {
  const { user } = useAuth();
  const [lang, setLang] = useState("EN");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: `Hello ${user?.name || "there"} 👋 I am your AI Health Assistant. Tell me what symptoms or health concerns you are experiencing, and I'll help you organize key details, understand terminology, and prepare questions for your doctor.`,
    },
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const checkEmergency = (text) => {
    const lower = text.toLowerCase();
    return (
      lower.includes("chest pain") ||
      lower.includes("heart attack") ||
      lower.includes("shortness of breath") ||
      lower.includes("difficulty breathing") ||
      lower.includes("stroke") ||
      lower.includes("severe bleeding") ||
      lower.includes("unconscious")
    );
  };

  const sendMessage = async (textToSend) => {
    const content = textToSend ?? input;
    if (!content.trim() || loading) return;

    const isEmergency = checkEmergency(content);
    if (isEmergency) setEmergencyAlert(true);

    const newMessages = [...messages, { role: "user", text: content }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const prompt = lang === "हिंदी" ? `${content} (Please reply in simple Hindi / Hinglish)` : content;
      const res = await askAssistant(prompt);
      setMessages([...newMessages, { role: "bot", text: res.reply }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "bot",
          text: "I encountered an issue processing your query. Please consult with a healthcare professional or try asking your question again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "bot",
        text: `Chat reset. What would you like to discuss or organize for your healthcare visit?`,
      },
    ]);
    setEmergencyAlert(false);
  };

  return (
    <div className="assistant-page">
      <div className="assistant-header-row">
        <div>
          <div className="assistant-title">AI Health Assistant</div>
          <div className="assistant-sub">
            Intelligent symptom context & doctor visit preparation aid.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className="lang-toggle"
            onClick={() => setLang((l) => (l === "EN" ? "हिंदी" : "EN"))}
          >
            <Languages size={14} /> {lang === "EN" ? "English" : "हिंदी"}
          </button>
          <button
            onClick={clearChat}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--muted-fg)",
              fontSize: 13,
              cursor: "pointer",
            }}
            title="Reset conversation"
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>
      </div>

      {emergencyAlert && (
        <div
          style={{
            padding: "14px 18px",
            background: "#fee2e2",
            border: "1px solid #f87171",
            borderRadius: 12,
            marginBottom: 16,
            color: "#991b1b",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 13 }}>
            <strong>Potential Emergency Detected:</strong> If you are experiencing chest pain,
            severe shortness of breath, sudden numbness, or heavy bleeding, please call emergency
            services (112 or 911) or proceed immediately to the nearest hospital emergency room.
          </div>
        </div>
      )}

      <div className="assistant-grid">
        <div className="chat-panel">
          <div className="chat-window">
            {messages.map((m, i) => (
              <div key={i} className={`chat-row ${m.role === "user" ? "user" : ""}`}>
                <div className="chat-avatar">
                  {m.role === "bot" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="chat-bubble markdown-body">
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-row">
                <div className="chat-avatar">
                  <Bot size={16} />
                </div>
                <div className="chat-bubble" style={{ color: "var(--muted-fg)" }}>
                  Analyzing health context...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-bar">
            <input
              className="chat-input"
              placeholder="Describe symptoms, ask about medications, or prepare visit questions..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Send Message"
            >
              <Send size={17} />
            </button>
          </div>
        </div>

        <div className="assistant-sidebar">
          <div className="emergency-card">
            <div className="emergency-head">
              <AlertTriangle size={16} /> Emergency Triage Shield
            </div>
            <p className="emergency-text">
              Our system continuously monitors for critical red-flag terms and prompts immediate
              emergency protocols for cardiac, respiratory, and neurological emergencies.
            </p>
          </div>

          <div className="quick-panel">
            <div className="quick-head">
              <Sparkles size={16} color="var(--primary)" /> Suggested Inquiries
            </div>
            <div className="quick-list">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  className="quick-item"
                  onClick={() => sendMessage(p)}
                  disabled={loading}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
