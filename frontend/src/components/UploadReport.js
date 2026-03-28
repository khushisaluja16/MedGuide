import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function UploadReport({ cardStyle }) {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientId, setPatientId] = useState(null);

const handleSubmit = () => {
  if (!patientName || !patientAge || !patientGender) {
    alert("Please fill in all fields.");
    return;
  }
  const id = "PAT-" + Math.floor(100000 + Math.random() * 900000);
  setPatientId(id);
  navigate("/report", { state: { patientId: id, patientName, patientAge, patientGender } });
};

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.08)";
      }}
    >

      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "22px" }}>🧪</span>
        <h3 style={{ margin: 0 }}>Upload Lab Report</h3>
      </div>

      {/* SUBTEXT */}
      <p style={{ color: "#666", marginTop: "5px" }}>
        Upload medical reports
      </p>

      {/* BUTTON */}
{showForm ? (
  <div style={{ marginTop: "12px" }}>
    <input placeholder="Patient Name" value={patientName}
      onChange={(e) => setPatientName(e.target.value)}
      style={{ width: "100%", padding: "9px", borderRadius: "10px", border: "1px solid #d1d5db", marginBottom: "8px", boxSizing: "border-box" }}
    />
    <input placeholder="Age" type="number" value={patientAge}
      onChange={(e) => setPatientAge(e.target.value)}
      style={{ width: "100%", padding: "9px", borderRadius: "10px", border: "1px solid #d1d5db", marginBottom: "8px", boxSizing: "border-box" }}
    />
    <select value={patientGender} onChange={(e) => setPatientGender(e.target.value)}
      style={{ width: "100%", padding: "9px", borderRadius: "10px", border: "1px solid #d1d5db", marginBottom: "8px", boxSizing: "border-box" }}
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>

    {patientId && (
      <div style={{ background: "#e0f2fe", border: "1px solid #7dd3fc", borderRadius: "10px", padding: "8px 12px", marginBottom: "10px", fontSize: "13px", color: "#0369a1", fontWeight: "600" }}>
        ✅ Patient ID: {patientId}
      </div>
    )}

    <button onClick={handleSubmit}
      style={{ width: "100%", padding: "12px", background: "linear-gradient(90deg, #2b7de9, #4facfe)", color: "white", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer" }}>
      Continue to Upload →
    </button>
    <button onClick={() => setShowForm(false)}
      style={{ width: "100%", padding: "12px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer", marginTop: "6px" }}>
      Cancel
    </button>
  </div>
) : (
  <button onClick={() => setShowForm(true)}
    style={{ marginTop: "15px", width: "100%", padding: "12px", background: "linear-gradient(90deg, #2b7de9, #4facfe)", color: "white", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer" }}>
    Upload Image
  </button>
)}
    </div>
  );
}

export default UploadReport;