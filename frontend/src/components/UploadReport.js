import React from "react";

function UploadReport({ cardStyle }) {
  return (
    <div style={cardStyle}>

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
      <button style={{
        marginTop: "15px",
        width: "100%",
        padding: "12px",
        background: "linear-gradient(90deg, #2b7de9, #4facfe)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontWeight: "600",
        cursor: "pointer"
      }}>
        Upload Image
      </button>

    </div>
  );
}

export default UploadReport;