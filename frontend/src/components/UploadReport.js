import React from "react";
import { useNavigate } from "react-router-dom";
function UploadReport({ cardStyle }) {
  const navigate = useNavigate();
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
<button
  onClick={() => navigate("/report")}
  style={{
    marginTop: "15px",
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg, #2b7de9, #4facfe)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer"
  }}
>
  Upload Image
</button>
    </div>
  );
}

export default UploadReport;