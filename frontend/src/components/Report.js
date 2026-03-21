import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";

const todayStr = new Date().toLocaleDateString("en-GB", {
  day: "2-digit", month: "short", year: "numeric",
});

// ── Result Card ───────────────────────────────────────────────────────────────
function ResultCard({ icon, title, items, loading, accent, learnMore, onLearnMore }) {
  const accentMap = {
    red:    { bg: "#fff1f2", border: "#fecaca", iconBg: "#fee2e2", iconColor: "#ef4444" },
    blue:   { bg: "#eff6ff", border: "#bfdbfe", iconBg: "#dbeafe", iconColor: "#2b7de9" },
    green:  { bg: "#f0fdf4", border: "#bbf7d0", iconBg: "#dcfce7", iconColor: "#16a34a" },
    purple: { bg: "#faf5ff", border: "#e9d5ff", iconBg: "#ede9fe", iconColor: "#7c3aed" },
  };
  const a = accentMap[accent] || accentMap.blue;

  return (
    <div style={{
      background: a.bg, border: `1.5px solid ${a.border}`,
      borderRadius: "18px", padding: "22px 24px",
      display: "flex", flexDirection: "column", gap: "12px",
      height: "100%", boxSizing: "border-box",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.09)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "46px", height: "46px", borderRadius: "13px",
            background: a.iconBg, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "24px", flexShrink: 0,
          }}>
            {icon}
          </div>
          <span style={{ fontWeight: "700", fontSize: "18px", color: "#1e3a5f", letterSpacing: "-0.2px" }}>
            {title}
          </span>
        </div>
        {learnMore && (
          <button onClick={onLearnMore} style={{
            padding: "6px 16px", borderRadius: "20px", fontSize: "13.5px",
            border: `1.5px solid ${a.iconColor}`, background: "white",
            color: a.iconColor, cursor: "pointer", fontWeight: "600",
            transition: "all 0.15s", flexShrink: 0,
          }}
            onMouseEnter={e => { e.target.style.background = a.iconBg; }}
            onMouseLeave={e => { e.target.style.background = "white"; }}
          >
            Learn More
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1 }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                height: "16px", borderRadius: "8px",
                background: "linear-gradient(90deg,#e5eaf5 25%,#f0f4ff 50%,#e5eaf5 75%)",
                backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
                width: i === 3 ? "60%" : "100%",
              }} />
            ))}
          </div>
        ) : items && items.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
            {items.map((item, i) => (
              <li key={i} style={{
                display: "flex", gap: "11px", alignItems: "flex-start",
                fontSize: "15.5px", color: "#374151", lineHeight: "1.65",
              }}>
                <span style={{
                  width: "23px", height: "23px", borderRadius: "50%",
                  background: a.iconBg, color: a.iconColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: "700", flexShrink: 0, marginTop: "2px",
                }}>
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ margin: 0, color: "#9ca3af", fontStyle: "italic", fontSize: "15px", lineHeight: "1.7" }}>
            Results will appear here after analysis.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Chat Bubble ───────────────────────────────────────────────────────────────
function ChatBubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: "10px" }}>
      {!isUser && (
        <div style={{
          width: "30px", height: "30px", borderRadius: "50%",
          background: "linear-gradient(135deg,#2b7de9,#1a5fbb)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", marginRight: "7px", flexShrink: 0, alignSelf: "flex-end",
        }}>🩺</div>
      )}
      <div style={{
        maxWidth: "80%",
        background: isUser ? "linear-gradient(135deg,#2b7de9,#1a5fbb)" : "white",
        color: isUser ? "white" : "#1e3a5f",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        padding: "12px 16px", fontSize: "14.5px", lineHeight: "1.65",
        boxShadow: isUser ? "0 4px 12px rgba(43,125,233,0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
        border: isUser ? "none" : "1px solid #e5eaf5",
      }}>
        {text}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Report() {

  const [form, setForm]               = useState({ name: "", age: "", gender: "", bp: "" });
  const [file, setFile]               = useState(null);
  const [fileURL, setFileURL]         = useState(null);
  const [fileName, setFileName]       = useState("");
  const [loading, setLoading]         = useState(false);
  const [reportTitle, setReportTitle] = useState(null);
  const [results, setResults]         = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Hi! I'm your MedGuide AI Assistant. Upload a report and fill in your details — then ask me anything about your results! 🩺" },
  ]);
  const [chatInput, setChatInput]     = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const fileRef      = useRef();
  const chatEndRef   = useRef();
  const chatInputRef = useRef();   // used by "Learn More" to focus chat
  const API          = "https://api.anthropic.com/v1/messages";

  // ── File handlers ─────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setFileName(f.name);
    setFileURL(URL.createObjectURL(f));
  };

  // ✕ Cancel / remove uploaded file
  const handleRemoveFile = () => {
    setFile(null);
    setFileName("");
    setFileURL(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // "Learn More" on Possible Diseases → focus chat input with pre-filled question
  const handleLearnMore = () => {
    setChatInput("Tell me more about the possible diseases found in my report.");
    setTimeout(() => {
      chatInputRef.current?.focus();
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const fileToBase64 = (f) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(f);
  });

  const buildPrompt = (vitalsText) => `
You are a professional medical AI assistant. A patient has submitted their medical report and personal details.

Patient Info:
- Name: ${form.name || "Unknown"}
- Age: ${form.age || "Unknown"}
- Gender: ${form.gender || "Unknown"}
- Blood Pressure: ${form.bp || "Not provided"}

Extracted Report / Vitals Data:
${vitalsText}

Instructions:
Compare the vitals with standard healthy ranges for this patient's age and gender.
Return a JSON object ONLY (no markdown, no extra text) with this exact structure:
{
  "reportType": "string (e.g. Complete Blood Count, Lipid Panel, Thyroid Test)",
  "healthRiskAssessment": ["point 1", "point 2", "point 3"],
  "possibleDiseases": ["disease 1", "disease 2", "disease 3"],
  "preventiveMeasures": ["measure 1", "measure 2", "measure 3"],
  "lifestyleSuggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}
`.trim();

  const handleAnalyse = async () => {
    if (!form.name || !form.age) {
      alert("Please enter at least your Name and Age before analysing.");
      return;
    }
    setLoading(true);
    setResults(null);
    setReportTitle(null);

    try {
      let messages;
      if (file) {
        const b64 = await fileToBase64(file);
        if (file.type.startsWith("image/")) {
          messages = [{ role: "user", content: [
            { type: "image",    source: { type: "base64", media_type: file.type, data: b64 } },
            { type: "text",     text: buildPrompt("(See uploaded image — extract all vitals and lab values.)") },
          ]}];
        } else if (file.type === "application/pdf") {
          messages = [{ role: "user", content: [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } },
            { type: "text",     text: buildPrompt("(See uploaded PDF — extract all vitals and lab values.)") },
          ]}];
        } else {
          messages = [{ role: "user", content: buildPrompt("No extractable file. Use only the manually provided data.") }];
        }
      } else {
        messages = [{ role: "user", content: buildPrompt("No file uploaded. Use only the manually entered data to reason about possible health risks.") }];
      }

      const res    = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages }),
      });
      const data   = await res.json();
      const raw    = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

      setResults(parsed);
      setReportTitle(parsed.reportType || "Medical Report");
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    const q = chatInput.trim();
    if (!q || chatLoading) return;

    const newMsgs = [...chatMessages, { role: "user", text: q }];
    setChatMessages(newMsgs);
    setChatInput("");
    setChatLoading(true);

    try {
      const ctx = results
        ? `Patient: ${form.name}, Age: ${form.age}, Gender: ${form.gender}, BP: ${form.bp}.
Health Risks: ${results.healthRiskAssessment?.join("; ")}.
Possible Diseases: ${results.possibleDiseases?.join("; ")}.
Preventive: ${results.preventiveMeasures?.join("; ")}.
Lifestyle: ${results.lifestyleSuggestions?.join("; ")}.`
        : `Patient: ${form.name}, Age: ${form.age}, Gender: ${form.gender}, BP: ${form.bp}. No report analysed yet.`;

      const apiMsgs = newMsgs.map((m, idx) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.role === "user" && idx === newMsgs.length - 1
          ? `Context:\n${ctx}\n\nQuestion: ${m.text}`
          : m.text,
      }));

      const res   = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: "You are MedGuide AI, a helpful and friendly medical assistant. Answer clearly and concisely. Always remind users to consult a qualified doctor.",
          messages: apiMsgs,
        }),
      });
      const data  = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Sorry, I couldn't respond.";
      setChatMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", text: "Network error. Please try again." }]);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: "linear-gradient(160deg, #8ec5fc 0%, #c8e6ff 40%, #e0f3ff 100%)",
      padding: "20px 28px 28px", boxSizing: "border-box",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
    }}>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes spin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
        input::placeholder, textarea::placeholder { color: #b0c4de; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>

      {/* Navbar — auto-highlights "Reports" because pathname = /report */}
      <Navbar />

      <div style={{ display: "flex", gap: "20px", flex: 1, alignItems: "stretch" }}>

        {/* ════════════════════════════════════════════════════════════════
            LEFT — Patient Input
            fills full height, disclaimer pinned at bottom
            ════════════════════════════════════════════════════════════════ */}
        <div style={{ width: "23%", minWidth: "220px", display: "flex", flexDirection: "column" }}>
          <div style={{
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
            borderRadius: "20px", padding: "22px 20px",
            boxShadow: "0 4px 24px rgba(31,110,212,0.09)",
            border: "1px solid rgba(200,225,255,0.6)",
            flex: 1, display: "flex", flexDirection: "column",
            animation: "fadeUp 0.4s ease",
          }}>

            {/* Panel heading */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid #e5eaf5",
            }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "10px",
                background: "linear-gradient(135deg,#2b7de9,#1a5fbb)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
              }}>🧑‍⚕️</div>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1e3a5f" }}>
                Patient Details
              </h3>
            </div>

            {/* ── File preview with ✕ cancel button ────────────────── */}
            {file && (
              <div style={{
                marginBottom: "14px", borderRadius: "14px",
                border: "1.5px solid #bfdbfe", overflow: "hidden",
                background: "#eff6ff", animation: "fadeUp 0.3s ease",
                position: "relative",
              }}>
                {/* ✕ Remove button — red circle top-right */}
                <button
                  onClick={handleRemoveFile}
                  title="Remove file"
                  style={{
                    position: "absolute", top: "8px", right: "8px", zIndex: 10,
                    width: "26px", height: "26px", borderRadius: "50%",
                    background: "rgba(239,68,68,0.92)", color: "white",
                    border: "2px solid white", cursor: "pointer",
                    fontSize: "13px", fontWeight: "700",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.25)", lineHeight: 1,
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >✕</button>

                {file.type.startsWith("image/") ? (
                  <img src={fileURL} alt="Preview"
                    style={{ width: "100%", maxHeight: "130px", objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ padding: "14px 14px 10px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "32px" }}>📄</span>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#1e3a5f",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fileName}</p>
                      <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#6b7280" }}>PDF Document</p>
                    </div>
                  </div>
                )}

                {/* Footer bar: filename + View link */}
                <div style={{
                  padding: "7px 12px", display: "flex", justifyContent: "space-between",
                  alignItems: "center", borderTop: "1px solid #bfdbfe", background: "white",
                }}>
                  <span style={{
                    fontSize: "13px", color: "#374151", fontWeight: "500",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "130px",
                  }}>
                    {fileName}
                  </span>
                  <a href={fileURL} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: "13px", color: "#2b7de9", fontWeight: "700",
                    textDecoration: "none", background: "#dbeafe",
                    padding: "3px 12px", borderRadius: "20px", whiteSpace: "nowrap",
                  }}>👁 View</a>
                </div>
              </div>
            )}

            {/* Upload button */}
            <input ref={fileRef} type="file" accept="image/*,.pdf"
              style={{ display: "none" }} onChange={handleFileChange} />
            <button onClick={() => fileRef.current.click()} style={{
              width: "100%", padding: "13px", borderRadius: "12px",
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              color: "white", fontWeight: "700", fontSize: "16px",
              border: "none", cursor: "pointer", marginBottom: "18px",
              boxShadow: "0 4px 14px rgba(34,197,94,0.3)", transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              {file ? "🔄 Change Report" : "📤 Upload Report"}
            </button>

            {/* Form fields */}
            {[
              { key: "name",   label: "Full Name",                    ph: "Enter your name…"       },
              { key: "age",    label: "Age",                          ph: "Enter your age…"        },
              { key: "gender", label: "Gender",                       ph: "Male / Female / Other…" },
              { key: "bp",     label: "Blood Pressure (e.g. 120/80)", ph: "Enter BP…"              },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: "13px" }}>
                <label style={{
                  display: "block", fontSize: "15px", fontWeight: "600",
                  color: "#1e3a5f", marginBottom: "6px",
                }}>
                  {f.label}
                </label>
                <input
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.ph}
                  style={{
                    width: "100%", padding: "11px 14px", borderRadius: "10px",
                    border: "1.5px solid #d1dff5", fontSize: "15px",
                    color: "#374151", background: "rgba(240,248,255,0.7)",
                    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#2b7de9"}
                  onBlur={e => e.target.style.borderColor  = "#d1dff5"}
                />
              </div>
            ))}

            {/* Analyse button */}
            <button onClick={handleAnalyse} disabled={loading} style={{
              width: "100%", padding: "14px", borderRadius: "12px",
              background: loading ? "#93b8e8" : "linear-gradient(135deg,#2b7de9,#1a5fbb)",
              color: "white", fontWeight: "700", fontSize: "16.5px",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 16px rgba(43,125,233,0.35)",
              marginTop: "4px", transition: "all 0.2s",
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {loading
                ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
                    Analysing…
                  </span>
                : "🔍 Analyse Report"
              }
            </button>

            {/* Spacer — pushes disclaimer to the very bottom */}
            <div style={{ flex: 1 }} />

            {/* Disclaimer — fills bottom gap */}
            <div style={{
              marginTop: "16px", padding: "14px 12px",
              background: "rgba(241,245,249,0.9)",
              borderRadius: "12px", border: "1px solid #e2e8f0",
              textAlign: "center",
            }}>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b", lineHeight: "1.7" }}>
                ⚠️ <strong>AI-assisted tool only.</strong><br />
                Always consult a qualified doctor before making any health decisions.
              </p>
            </div>

          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            CENTER — Results
            ════════════════════════════════════════════════════════════════ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Blue banner */}
          <div style={{
            background: "linear-gradient(120deg, #1a5fbb 0%, #2b7de9 55%, #38a0ff 100%)",
            borderRadius: "20px", padding: "22px 28px", flexShrink: 0,
            boxShadow: "0 6px 24px rgba(31,110,212,0.25)",
            display: "flex", alignItems: "center", gap: "16px",
            animation: "fadeUp 0.35s ease",
          }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px",
              background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "30px", flexShrink: 0,
            }}>
              {loading
                ? <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span>
                : "🩺"}
            </div>
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: "800", color: "white", letterSpacing: "-0.3px" }}>
                {reportTitle
                  ? `Report Analysis: ${reportTitle} — ${todayStr}`
                  : "AI-Powered Health Report Analysis"}
              </h2>
              <p style={{ margin: 0, fontSize: "17px", color: "rgba(255,255,255,0.8)", fontWeight: "500" }}>
                {reportTitle
                  ? "AI-generated insights from your uploaded report"
                  : "Upload a report & fill in patient details, then click Analyse"}
              </p>
            </div>
          </div>

          {/* 2×2 result grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr", gap: "16px", flex: 1,
          }}>
            <ResultCard icon="❤️‍🔥" title="Health Risk Assessment"
              items={results?.healthRiskAssessment} loading={loading} accent="red" />
            {/* "Learn More" focuses the AI chat input */}
            <ResultCard icon="🔬"    title="Possible Diseases"
              items={results?.possibleDiseases}     loading={loading} accent="blue"
              learnMore onLearnMore={handleLearnMore} />
            <ResultCard icon="🌿"    title="Preventive Measures"
              items={results?.preventiveMeasures}   loading={loading} accent="green" />
            <ResultCard icon="🏃"    title="Lifestyle Suggestions"
              items={results?.lifestyleSuggestions} loading={loading} accent="purple" />
          </div>

          {/* Disclaimer — shown after results load */}
          {results && (
            <div style={{
              background: "rgba(255,251,235,0.95)", border: "1.5px solid #fde68a",
              borderRadius: "14px", padding: "14px 20px",
              display: "flex", alignItems: "center", gap: "10px",
              flexShrink: 0, animation: "fadeUp 0.4s ease",
            }}>
              <span style={{ fontSize: "20px" }}>⚕️</span>
              <p style={{ margin: 0, fontSize: "14px", color: "#92400e", fontWeight: "500", lineHeight: "1.6" }}>
                <strong>Medical Disclaimer:</strong> Results are AI-generated for informational purposes only.
                Please consult a licensed physician before making any health decisions.
              </p>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════════
            RIGHT — AI Chat
            ════════════════════════════════════════════════════════════════ */}
        <div style={{ width: "25%", minWidth: "220px", display: "flex", flexDirection: "column" }}>
          <div style={{
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
            borderRadius: "20px",
            boxShadow: "0 4px 24px rgba(31,110,212,0.09)",
            border: "1px solid rgba(200,225,255,0.6)",
            flex: 1, display: "flex", flexDirection: "column",
            overflow: "hidden", animation: "fadeUp 0.5s ease",
          }}>

            {/* Chat header */}
            <div style={{
              padding: "16px 20px",
              background: "linear-gradient(135deg, #2b7de9, #1a5fbb)",
              display: "flex", alignItems: "center", gap: "12px",
              borderRadius: "20px 20px 0 0", flexShrink: 0,
            }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "50%",
                background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
              }}>🩺</div>
              <div>
                <p style={{ margin: 0, color: "white", fontWeight: "700", fontSize: "20.5px" }}>MedGuide AI</p>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "15.00px" }}>Ask about your report</p>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "#4ade80", boxShadow: "0 0 6px #4ade80",
                }} />
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px" }}>Online</span>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: "auto", padding: "16px 14px 8px",
              display: "flex", flexDirection: "column", background: "#f8faff",
            }}>
              {chatMessages.map((m, i) => <ChatBubble key={i} role={m.role} text={m.text} />)}
              {chatLoading && (
                <div style={{ display: "flex", gap: "7px", alignItems: "flex-end", marginBottom: "10px" }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "linear-gradient(135deg,#2b7de9,#1a5fbb)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px",
                  }}>🩺</div>
                  <div style={{
                    background: "white", border: "1px solid #e5eaf5",
                    borderRadius: "18px 18px 18px 4px", padding: "12px 16px",
                    display: "flex", gap: "5px", alignItems: "center",
                  }}>
                    {[0,1,2].map(j => (
                      <div key={j} style={{
                        width: "7px", height: "7px", borderRadius: "50%", background: "#2b7de9",
                        animation: `shimmer 1.2s ease ${j * 0.2}s infinite`, opacity: 0.6,
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick prompts */}
            <div style={{
              padding: "10px 14px 6px", display: "flex", flexWrap: "wrap", gap: "6px",
              background: "#f8faff", borderTop: "1px solid #e5eaf5", flexShrink: 0,
            }}>
              {["What is LDL?", "Normal BP range?", "Explain HbA1c"].map(q => (
                <button key={q} onClick={() => setChatInput(q)} style={{
                  padding: "5px 12px", borderRadius: "20px", fontSize: "13px",
                  border: "1.5px solid #bfdbfe", background: "white", color: "#1a5fbb",
                  cursor: "pointer", fontWeight: "600", transition: "all 0.15s",
                }}
                  onMouseEnter={e => e.target.style.background = "#dbeafe"}
                  onMouseLeave={e => e.target.style.background = "white"}
                >{q}</button>
              ))}
            </div>

            {/* Chat input — ref lets "Learn More" focus it */}
            <div style={{
              padding: "10px 14px 14px", borderTop: "1px solid #e5eaf5",
              display: "flex", gap: "8px", alignItems: "flex-end",
              background: "white", flexShrink: 0, borderRadius: "0 0 20px 20px",
            }}>
              <textarea
                ref={chatInputRef}
                rows={2}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleChat(); } }}
                placeholder="Ask about your report…"
                style={{
                  flex: 1, padding: "10px 13px", borderRadius: "13px",
                  border: "1.5px solid #d1dff5", fontSize: "14.5px",
                  resize: "none", background: "#f8faff", outline: "none",
                  color: "#374151", lineHeight: "1.5", fontFamily: "inherit",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#2b7de9"}
                onBlur={e => e.target.style.borderColor  = "#d1dff5"}
              />
              <button onClick={handleChat} disabled={chatLoading} style={{
                width: "44px", height: "44px", borderRadius: "13px",
                background: chatLoading ? "#93b8e8" : "linear-gradient(135deg,#2b7de9,#1a5fbb)",
                color: "white", border: "none", cursor: chatLoading ? "not-allowed" : "pointer",
                fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 3px 10px rgba(43,125,233,0.3)", flexShrink: 0,
              }}>➤</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}