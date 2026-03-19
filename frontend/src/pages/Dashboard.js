import React from "react";
import Navbar from "../components/Navbar";
import UploadReport from "../components/UploadReport";
import SymptomChecker from "../components/SymptomChecker";
import SearchMedicine from "../components/SearchMedicine";

function Dashboard() {

  const bodyStyle = {
    display: "flex",
    gap: "30px",
    width: "100%",
    paddingLeft: "10px",
    alignItems: "stretch"   
  };

  const leftPanel = { width: "24%" };
  const centerPanel = {
    width: "48%",
    display: "flex",
    flexDirection: "column",
    gap: "18px"   
  };
  const rightPanel = { width: "28%" };

  const card = {
    background: "white",
    padding: "18px 20px",
    borderRadius: "18px",
    marginBottom: "18px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
  };

  const iconBox = {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    background: "#d9ecff",
    boxShadow: "0 6px 15px rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const titleStyle = {
    margin: "0 0 6px 0",
    fontWeight: "600",
    fontSize: "20px"
  };

  const descStyle = {
    margin: 0,
    color: "#6b7280",
    fontSize: "15.5px",
    lineHeight: "1.7"
  };

  const sectionHeader = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "600",
    fontSize: "17px",
    marginBottom: "12px"
  };

  const row = {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "10px"
  };

  const text = {
    fontSize: "15.5px",  
    color: "#374151",     
    lineHeight: "1.6"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #8ec5fc, #e0f3ff)",
        padding: "20px 30px",
        boxSizing: "border-box"
      }}
    >

      <Navbar />

      <div style={bodyStyle}>

        {/* LEFT PANEL */}
        <div style={leftPanel}>
          <UploadReport cardStyle={card} />
          <SymptomChecker cardStyle={card} />
          <SearchMedicine cardStyle={card} />
        </div>

        {/* CENTER PANEL */}
        <div style={centerPanel}>

          <div style={{ ...card, flex: 1 }}>

            <h1 style={{
              marginBottom: "10px",
              fontSize: "28px",
              fontWeight: "700"
            }}>
              What MedGuide Does
            </h1>

            <hr style={{
              border: "none",
              height: "1px",
              background: "#e5e7eb",
              marginBottom: "20px"
            }} />

            {/* ITEM 1 */}
            <div style={{ display: "flex", gap: "18px", marginBottom: "20px" }}>

              <div style={iconBox}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1f6ed4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <circle cx="11" cy="15" r="3" />
                  <line x1="16" y1="20" x2="13.5" y2="17.5" />
                </svg>
              </div>

              <div>
                <h3 style={titleStyle}>Analyze and Save Reports</h3>
                <p style={descStyle}>
                  Upload an image of a handwritten prescription to extract medicine details.
                </p>
              </div>

            </div>

            {/* ITEM 2 */}
            <div style={{ display: "flex", gap: "18px", marginBottom: "20px" }}>

              <div style={iconBox}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1f6ed4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="18" rx="2" />
                  <rect x="14" y="8" width="7" height="13" rx="2" />
                  <line x1="3" y1="10" x2="10" y2="10" />
                  <line x1="14" y1="14" x2="21" y2="14" />
                </svg>
              </div>

              <div>
                <h3 style={titleStyle}>Smart Medicine Insights</h3>
                <p style={descStyle}>
                  Get detailed information on prescribed medicines, including composition,
                  uses, and potential side effects.
                </p>
              </div>

            </div>

            {/* ITEM 3 */}
            <div style={{ display: "flex", gap: "18px" }}>

              <div style={iconBox}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1f6ed4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15 15 0 0 1 0 20" />
                  <path d="M12 2a15 15 0 0 0 0 20" />
                </svg>
              </div>

              <div>
                <h3 style={titleStyle}>Find Health Resources</h3>
                <p style={descStyle}>
                  Find health resources, access reports, and explore health tools for clarity.
                </p>
              </div>

            </div>

          </div>

          {/* PREVIOUS REPORTS */}
          <div style={card}>

            <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              📁 Previous Reports
            </h3>

            <p style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
              <span style={{ color: "#2b7de9", fontSize: "18px" }}>📄</span>
              12 Apr 2026 – Fever Prescription
            </p>

            <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#2b7de9", fontSize: "18px" }}>📄</span>
              05 Apr 2026 – Blood Test Report
            </p>

          </div>

          

        </div>

        <div style={rightPanel}>

          {/* HEALTH TIPS */}
          <div style={card}>
            <div style={sectionHeader}>
              💚 <span>Health Tips</span>
            </div>

            <div style={row}>
              <span>•</span>
              <span style={text}>
                Stay hydrated: Drink at least 8 glasses of water daily
              </span>
            </div>

            <div style={row}>
              <span>•</span>
              <span style={text}>
                Avoid self-medication. Consult your doctor before taking new medicines.
              </span>
            </div>

            <div style={row}>
              <span>•</span>
              <span style={text}>
                Complete the full course of antibiotics even if you feel better
              </span>
            </div>
          </div>

          {/* MEDICINE ALERTS */}
          <div style={card}>
            <div style={sectionHeader}>
              ⚠️ <span>Medicine Alerts</span>
            </div>

            <div style={row}>
              ⚠️
              <span style={text}>
                Paracetamol: Avoid exceeding 4000 mg per day to prevent liver damage
              </span>
            </div>

            <div style={row}>
              ⚠️
              <span style={text}>
                Azithromycin might cause stomach upset (take with food)
              </span>
            </div>
          </div>

          {/* EMERGENCY CONTACTS */}
          <div style={card}>
            <div style={sectionHeader}>
              🚑 <span>Emergency Contacts</span>
            </div>

            <div style={row}>
              📞 <span style={text}>Ambulance: 102</span>
            </div>

            <div style={row}>
              🚓 <span style={text}>Emergency: 112</span>
            </div>

            <div style={row}>
              ☠️ <span style={text}>Poison Control: 1066</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;