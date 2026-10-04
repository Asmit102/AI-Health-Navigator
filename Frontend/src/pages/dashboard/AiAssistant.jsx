import { askAssistant } from "../../services/aiService";
import { useState, useRef, useEffect } from "react";
import { Bot, User, Languages, AlertTriangle, Sparkles, Send } from "lucide-react";

const quickPrompts = [
  "I've had a headache for 3 days",
  "Explain my last blood report",
  "What should I ask my doctor tomorrow?",
  "Track my medicine intake",
];

export default function AiAssistant() {
  const [lang, setLang] = useState("EN");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi Ananya 👋 Tell me how you're feeling today — symptoms, duration, or anything you noticed. I'll organize it for your doctor.",
    },
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const sendMessage = async (text) => {
    const content = text ?? input;
    if (!content.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: content }]);
    setInput("");

    // Show a temporary "typing" bubble
    setMessages((prev) => [...prev, { role: "bot", text: "Thinking...", isTyping: true }]);

    try {
      const res = await askAssistant(content);

      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => !m.isTyping);
        return [...withoutTyping, { role: "bot", text: res.reply }];
      });
    } catch {
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => !m.isTyping);
        return [...withoutTyping, { role: "bot", text: "Sorry, something went wrong. Please try again." }];
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="assistant-page">
      <div className="assistant-header-row">
        <div>
          <div className="assistant-title">AI Health Assistant</div>
          <div className="assistant-sub">A communication aid — not a diagnosis.</div>
        </div>
        <button
          className="lang-toggle"
          onClick={() => setLang((l) => (l === "EN" ? "हिंदी" : "EN"))}
        >
          <Languages size={14} /> {lang === "EN" ? "EN" : "हिंदी"}
        </button>
      </div>

      <div className="assistant-grid">
        <div className="chat-panel">
          <div className="chat-window">
            {messages.map((m, i) => (
              <div key={i} className={`chat-row ${m.role === "user" ? "user" : ""}`}>
                <div className="chat-avatar">
                  {m.role === "bot" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="chat-bubble">{m.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-bar">
            <input
              className="chat-input"
              placeholder="Describe symptoms, ask a medical FAQ..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim()}
            >
              <Send size={17} />
            </button>
          </div>
        </div>

        <div className="assistant-sidebar">
          <div className="emergency-card">
            <div className="emergency-head">
              <AlertTriangle size={16} /> Emergency detection
            </div>
            <p className="emergency-text">
              If you mention chest pain, severe bleeding, or breathing difficulty — the assistant will suggest emergency services immediately.
            </p>
          </div>

          <div className="quick-panel">
            <div className="quick-head">
              <Sparkles size={16} color="var(--primary)" /> Quick prompts
            </div>
            <div className="quick-list">
              {quickPrompts.map((p) => (
                <button key={p} className="quick-item" onClick={() => sendMessage(p)}>
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