import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];
const activityLevels = ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"];

function Profile() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    bloodGroup: "",
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
    emergencyContact: "",
    activityLevel: "",
    smokingStatus: "No",
    alcoholUse: "No",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("medguide_profile");
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Save locally
    localStorage.setItem("medguide_profile", JSON.stringify(profile));

    // Optionally save to backend if email exists
    const email = localStorage.getItem("medguide_email");
    if (email) {
      try {
        await axios.post("http://127.0.0.1:8000/save-profile", {
          ...profile,
          email,
        });
      } catch (err) {
        console.log("Backend save failed, stored locally only");
      }
    }

    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    const stored = localStorage.getItem("medguide_profile");
    if (stored) setProfile(JSON.parse(stored));
    setEditing(false);
  };

  // BMI calculation
  const bmi =
    profile.weight && profile.height
      ? (parseFloat(profile.weight) / (parseFloat(profile.height) / 100) ** 2).toFixed(1)
      : null;

  const getBMIInfo = (val) => {
    if (!val) return null;
    const n = parseFloat(val);
    if (n < 18.5) return { label: "Underweight", color: "#3b82f6" };
    if (n < 25) return { label: "Normal", color: "#22c55e" };
    if (n < 30) return { label: "Overweight", color: "#f59e0b" };
    return { label: "Obese", color: "#ef4444" };
  };
  const bmiInfo = getBMIInfo(bmi);

  const initials = profile.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  // ── Shared styles matching Dashboard ──
  const card = {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(12px)",
    padding: "16px 18px",
    borderRadius: "18px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
    transition: "all 0.25s ease",
  };

  const hoverCard = {
    transform: "translateY(-4px) scale(1.01)",
    boxShadow: "0 16px 32px rgba(0,0,0,0.12)",
  };

  const label = {
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    minWidth: "150px",
  };

  const valueText = {
    fontSize: "14px",
    color: "#1f2937",
    fontWeight: "500",
  };

  const inputStyle = {
    width: "100%",
    border: "1.5px solid #bfdbfe",
    borderRadius: "8px",
    padding: "7px 11px",
    fontSize: "14px",
    color: "#1f2937",
    background: "rgba(255,255,255,0.9)",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const selectStyle = { ...inputStyle, cursor: "pointer" };

  const row = {
    display: "flex",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    gap: "12px",
  };

  const sectionTitle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "700",
    fontSize: "15px",
    color: "#1f2937",
    marginBottom: "4px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #dbeafe, #bfdbfe, #e0f2fe)",
        padding: "10px",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      <div style={{ maxWidth: "960px", margin: "10px auto 0", display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* ── TOP HEADER CARD ── */}
        <div
          style={{ ...card, display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverCard)}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.08)"; }}
        >
          {/* Avatar */}
          <div style={{
            width: "68px", height: "68px", borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #2f8dcb, #0a5c88)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", fontWeight: "700", color: "#fff",
            boxShadow: "0 4px 14px rgba(15,92,136,0.35)",
          }}>
            {initials}
          </div>

          {/* Name & subtitle */}
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#1f2937" }}>
              {profile.name || "Your Profile"}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>
              {[profile.age && `${profile.age} yrs`, profile.gender, profile.bloodGroup && `Blood: ${profile.bloodGroup}`].filter(Boolean).join(" · ") || "Complete your profile below"}
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {saved && (
              <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: "600", background: "#dcfce7", padding: "6px 14px", borderRadius: "20px" }}>
                ✓ Saved!
              </span>
            )}
            {editing ? (
              <>
                <button onClick={handleCancel} style={{
                  padding: "9px 18px", borderRadius: "10px", border: "1.5px solid #e5e7eb",
                  background: "#f9fafb", color: "#6b7280", fontSize: "13px", fontWeight: "600", cursor: "pointer",
                }}>Cancel</button>
                <button onClick={handleSave} style={{
                  padding: "9px 20px", borderRadius: "10px", border: "none",
                  background: "linear-gradient(135deg,#0a5c88,#2f8dcb)", color: "#fff",
                  fontSize: "13px", fontWeight: "600", cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(55,140,205,0.35)",
                }}>Save Profile</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} style={{
                padding: "9px 20px", borderRadius: "10px", border: "none",
                background: "linear-gradient(135deg,#0a5c88,#2f8dcb)", color: "#fff",
                fontSize: "13px", fontWeight: "600", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(55,140,205,0.35)",
              }}>✏️ Edit Profile</button>
            )}
          </div>
        </div>

        {/* ── BMI CARD (shows only when height+weight filled) ── */}
        {bmi && (
          <div
            style={{ ...card, display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverCard)}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.08)"; }}
          >
            <div style={{ textAlign: "center", minWidth: "70px" }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.8px" }}>BMI</div>
              <div style={{ fontSize: "34px", fontWeight: "800", color: bmiInfo?.color, lineHeight: 1.1 }}>{bmi}</div>
            </div>
            <div style={{ flex: 1, minWidth: "180px" }}>
              <div style={{ height: "10px", background: "#e5e7eb", borderRadius: "99px", overflow: "hidden", marginBottom: "6px" }}>
                <div style={{ height: "100%", width: `${Math.min((parseFloat(bmi) / 40) * 100, 100)}%`, background: bmiInfo?.color, borderRadius: "99px", transition: "width 0.6s ease" }} />
              </div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: bmiInfo?.color }}>{bmiInfo?.label}</span>
              <span style={{ fontSize: "12px", color: "#9ca3af", marginLeft: "8px" }}>· Healthy range: 18.5 – 24.9</span>
            </div>
          </div>
        )}

        {/* ── TWO COLUMN GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

          {/* Personal Info */}
          <div
            style={card}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverCard)}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.08)"; }}
          >
            <div style={sectionTitle}>👤 Personal Information</div>
            <hr style={{ border: "none", height: "1px", background: "#e5e7eb", margin: "8px 0 4px" }} />

            {[
              { label: "Full Name", name: "name", placeholder: "Enter your name" },
              { label: "Age", name: "age", placeholder: "e.g. 25", type: "number" },
            ].map(({ label: lbl, name, placeholder, type }) => (
              <div key={name} style={row}>
                <span style={label}>{lbl}</span>
                {editing
                  ? <input name={name} value={profile[name]} onChange={handleChange} placeholder={placeholder} type={type || "text"} style={inputStyle} />
                  : <span style={valueText}>{profile[name] || <em style={{ color: "#d1d5db" }}>Not set</em>}</span>}
              </div>
            ))}

            <div style={row}>
              <span style={label}>Gender</span>
              {editing
                ? <select name="gender" value={profile.gender} onChange={handleChange} style={selectStyle}>
                  <option value="">Select...</option>
                  {genderOptions.map(o => <option key={o}>{o}</option>)}
                </select>
                : <span style={valueText}>{profile.gender || <em style={{ color: "#d1d5db" }}>Not set</em>}</span>}
            </div>

            <div style={{ ...row, borderBottom: "none" }}>
              <span style={label}>Activity Level</span>
              {editing
                ? <select name="activityLevel" value={profile.activityLevel} onChange={handleChange} style={selectStyle}>
                  <option value="">Select...</option>
                  {activityLevels.map(o => <option key={o}>{o}</option>)}
                </select>
                : <span style={valueText}>{profile.activityLevel || <em style={{ color: "#d1d5db" }}>Not set</em>}</span>}
            </div>
          </div>

          {/* Physical Stats */}
          <div
            style={card}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverCard)}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.08)"; }}
          >
            <div style={sectionTitle}>📊 Physical Stats</div>
            <hr style={{ border: "none", height: "1px", background: "#e5e7eb", margin: "8px 0 4px" }} />

            {[
              { label: "Weight (kg)", name: "weight", placeholder: "e.g. 65" },
              { label: "Height (cm)", name: "height", placeholder: "e.g. 170" },
            ].map(({ label: lbl, name, placeholder }) => (
              <div key={name} style={row}>
                <span style={label}>{lbl}</span>
                {editing
                  ? <input name={name} value={profile[name]} onChange={handleChange} placeholder={placeholder} type="number" style={inputStyle} />
                  : <span style={valueText}>{profile[name] || <em style={{ color: "#d1d5db" }}>Not set</em>}</span>}
              </div>
            ))}

            <div style={row}>
              <span style={label}>Blood Group</span>
              {editing
                ? <select name="bloodGroup" value={profile.bloodGroup} onChange={handleChange} style={selectStyle}>
                  <option value="">Select...</option>
                  {bloodGroups.map(o => <option key={o}>{o}</option>)}
                </select>
                : <span style={valueText}>{profile.bloodGroup || <em style={{ color: "#d1d5db" }}>Not set</em>}</span>}
            </div>

            <div style={row}>
              <span style={label}>Smoking</span>
              {editing
                ? <select name="smokingStatus" value={profile.smokingStatus} onChange={handleChange} style={selectStyle}>
                  {["No", "Yes", "Former"].map(o => <option key={o}>{o}</option>)}
                </select>
                : <span style={valueText}>{profile.smokingStatus}</span>}
            </div>

            <div style={{ ...row, borderBottom: "none" }}>
              <span style={label}>Alcohol Use</span>
              {editing
                ? <select name="alcoholUse" value={profile.alcoholUse} onChange={handleChange} style={selectStyle}>
                  {["No", "Occasionally", "Regularly"].map(o => <option key={o}>{o}</option>)}
                </select>
                : <span style={valueText}>{profile.alcoholUse}</span>}
            </div>
          </div>

          {/* Medical History — full width */}
          <div
            style={{ ...card, gridColumn: "1 / -1" }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverCard)}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.08)"; }}
          >
            <div style={sectionTitle}>🏥 Medical History</div>
            <hr style={{ border: "none", height: "1px", background: "#e5e7eb", margin: "8px 0 4px" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              {[
                { label: "Known Allergies", name: "allergies", placeholder: "e.g. Penicillin, Peanuts" },
                { label: "Chronic Conditions", name: "chronicConditions", placeholder: "e.g. Diabetes, Hypertension" },
                { label: "Current Medications", name: "currentMedications", placeholder: "e.g. Metformin 500mg" },
                { label: "Emergency Contact", name: "emergencyContact", placeholder: "Name & Phone number" },
              ].map(({ label: lbl, name, placeholder }, i, arr) => (
                <div key={name} style={{ ...row, borderBottom: i < arr.length - 2 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                  <span style={{ ...label, minWidth: "160px" }}>{lbl}</span>
                  {editing
                    ? <input name={name} value={profile[name]} onChange={handleChange} placeholder={placeholder} style={inputStyle} />
                    : <span style={valueText}>{profile[name] || <em style={{ color: "#d1d5db" }}>Not set</em>}</span>}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── BACK TO DASHBOARD ONLY ── */}
        <div style={{ textAlign: "center", paddingBottom: "20px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "10px 28px", borderRadius: "10px", border: "none",
              background: "rgba(255,255,255,0.7)", color: "#1f6ed4",
              fontSize: "14px", fontWeight: "600", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            ← Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;