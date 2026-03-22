import React, { useState, useEffect } from "react";

function SymptomChecker({ cardStyle }) {
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load all symptoms on mount
  useEffect(() => {
    fetch("http://localhost:8000/get-symptoms")
      .then(res => res.json())
      .then(data => setAllSymptoms(data.symptoms || []))
      .catch(() => {});
  }, []);

  const filtered = allSymptoms.filter(s =>
    s.toLowerCase().includes(search.toLowerCase()) && !selected.includes(s)
  );

  const addSymptom = (s) => {
    setSelected([...selected, s]);
    setSearch("");
    setShowDropdown(false);
  };

  const removeSymptom = (s) => {
    const updated = selected.filter(x => x !== s);
    setSelected(updated);
    setResults([]);  
    setError(""); 
  };

  const handleCheck = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const query = selected.join(",");
      const res = await fetch(`http://localhost:8000/check-symptoms?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setError("No matching conditions found. Try adding more symptoms.");
      }
    } catch (e) {
      setError("Could not connect to backend.");
    }
    setLoading(false);
  };

  return (
    <div style={cardStyle}>
      <h3 style={{ margin: "0 0 4px 0" }}>🔍 Symptom Checker</h3>
      <p style={{ margin: "0 0 8px 0", color: "#6b7280", fontSize: "13px" }}>
        Select your symptoms
      </p>

      {/* Selected symptoms tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }}>
        {selected.map(s => (
          <span key={s} style={{
            background: "#dbeafe", color: "#1d4ed8",
            padding: "2px 8px", borderRadius: "12px",
            fontSize: "12px", display: "flex", alignItems: "center", gap: "4px"
          }}>
            {s.replace(/_/g, " ")}
            <span
              onClick={() => removeSymptom(s)}
              style={{ cursor: "pointer", fontWeight: "bold", color: "#ef4444" }}
            >×</span>
          </span>
        ))}
      </div>

      {/* Search input */}
      <div style={{ position: "relative" }}>
        <input
          style={{
            width: "100%", padding: "8px", borderRadius: "8px",
            border: "1px solid #d1d5db", boxSizing: "border-box", fontSize: "13px"
          }}
          placeholder="Search symptom... (e.g. fever, itching)"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
        />

        {/* Dropdown */}
        {showDropdown && search && filtered.length > 0 && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            background: "white", border: "1px solid #d1d5db",
            borderRadius: "8px", maxHeight: "150px", overflowY: "auto",
            zIndex: 1000, boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            {filtered.slice(0, 20).map(s => (
              <div
                key={s}
                onClick={() => addSymptom(s)}
                style={{
                  padding: "6px 10px", cursor: "pointer",
                  fontSize: "13px", borderBottom: "1px solid #f3f4f6"
                }}
                onMouseEnter={e => e.target.style.background = "#eff6ff"}
                onMouseLeave={e => e.target.style.background = "white"}
              >
                {s.replace(/_/g, " ")}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleCheck}
        style={{
          width: "100%", padding: "10px", background: "linear-gradient(90deg, #2b7de9, #4facfe)",
          color: "white", border: "none", borderRadius: "8px",
          cursor: "pointer", fontSize: "13px", fontWeight: "600",
          marginTop: "8px"
        }}
      >
        {loading ? "Checking..." : "Check Symptoms"}
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          {results.map((r, i) => (
            <div key={i} style={{
              background: "#f0f9ff", borderRadius: "8px",
              padding: "8px 10px", marginBottom: "6px",
              border: "1px solid #bae6fd"
            }}>
              <p style={{ fontWeight: "700", fontSize: "13px", margin: "0 0 4px 0", color: "#0369a1" }}>
                🩺 {r.disease}
              </p>
              <p style={{ fontSize: "12px", color: "#374151", margin: "0 0 4px 0" }}>
                {r.description?.slice(0, 120)}...
              </p>
              {r.precautions?.length > 0 && (
                <p style={{ fontSize: "12px", color: "#059669", margin: 0 }}>
                  ✅ {r.precautions.join(" • ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p style={{ color: "red", fontSize: "12px", marginTop: "8px" }}>⚠️ {error}</p>
      )}
    </div>
  );
}

export default SymptomChecker;