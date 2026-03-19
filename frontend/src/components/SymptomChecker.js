import React from "react";

function SymptomChecker({ cardStyle }) {
  return (
    <div style={cardStyle}>

      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "22px" }}>🔍</span>
        <h3 style={{ margin: 0 }}>Symptom Checker</h3>
      </div>

      {/* SUBTEXT */}
      <p style={{ color: "#666", marginTop: "5px" }}>
        Enter your symptoms
      </p>

      {/* INPUT */}
      <input
        placeholder="Type symptoms..."
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          marginTop: "10px"
        }}
      />

      {/* BUTTON */}
      <button style={{
        marginTop: "12px",
        width: "100%",
        padding: "10px",
        background: "#2b7de9",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontWeight: "500"
      }}>
        Check Symptoms
      </button>

    </div>
  );
}

export default SymptomChecker;