import React from "react";
import Navbar from "../components/Navbar";

function History() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #dbeafe, #bfdbfe, #e0f2fe)",
        padding: "10px",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <Navbar />

      <div style={{ maxWidth: "960px", margin: "10px auto 0" }}>
        <div style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          padding: "24px",
          borderRadius: "18px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
        }}>
          <h2 style={{ margin: "0 0 16px 0", fontSize: "22px", fontWeight: "700", color: "#1f2937" }}>
            📋 Medical History
          </h2>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            Your past reports and symptom checks will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default History;