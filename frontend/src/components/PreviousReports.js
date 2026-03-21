import React from "react";

function PreviousReports({cardStyle}){

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

      <h3>Previous Reports</h3>

      <ul>
        <li>12 Apr 2026 — Blood Test</li>
        <li>05 Apr 2026 — Urine Test</li>
      </ul>

    </div>
  )
}

export default PreviousReports;