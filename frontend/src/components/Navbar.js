import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import logo    from "../images/logo.png";
import userImg from "../images/user.png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);  // ← ADD

  const pathMap = {
    "/dashboard": "dashboard",
    "/report":    "report",
    "/history":   "history",
    "/profile":   "profile",
  };
  const current = pathMap[location.pathname] || "";

  const links = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    { id: "report",    label: "Reports",   path: "/report"    },
    { id: "history",   label: "History",   path: "/history"   },
    { id: "profile",   label: "Profile",   path: "/profile"   },
  ];

  // ← ADD logout handler
  const handleLogout = () => {
    localStorage.removeItem("medguide_profile");
    localStorage.removeItem("medguide_email");
    navigate("/");
  };


  const fullName = localStorage.getItem("medguide_username") || "User";
  const firstName = fullName.split(" ")[0];  

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        borderRadius: "40px",
        padding: "12px 25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}
    >
      {/* LEFT: LOGO */}
      <div
        onClick={() => navigate("/dashboard")}
        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
      >
        <img
          src={logo}
          alt="MedGuide Logo"
          style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }}
        />
        <span style={{ fontSize: "19px", fontWeight: "600", color: "#2b7de9" }}>
          MedGuide
        </span>
      </div>

      {/* CENTER: NAV LINKS */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {links.map((link, i) => {
          const isActive = current === link.id;
          return (
            <React.Fragment key={link.id}>
              {i > 0 && (
                <div style={{ width: "1px", height: "20px", background: "#aaa" }} />
              )}
              <span
                onClick={() => navigate(link.path)}
                style={{
                  fontSize:     isActive ? "18px"              : "17px",
                  fontWeight:   isActive ? "700"               : "500",
                  color:        isActive ? "#2b7de9"           : "#444",
                  borderBottom: isActive ? "3px solid #2b7de9" : "3px solid transparent",
                  paddingBottom: "4px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  userSelect: "none",
                }}
                onMouseEnter={e => { if (!isActive) e.target.style.color = "#2b7de9"; }}
                onMouseLeave={e => { if (!isActive) e.target.style.color = "#444";    }}
              >
                {link.label}
              </span>
            </React.Fragment>
          );
        })}
      </div>

      {/* RIGHT: USER + DROPDOWN */}
      <div style={{ position: "relative" }}>  {/* ← WRAP in relative div */}
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
        >
          <span style={{ fontSize: "18px", fontWeight: "500", color: "#333" }}>
            Welcome, <b>{firstName}</b>
          </span>
          <img
            src={userImg}
            alt="User"
            style={{ width: "35px", height: "35px", borderRadius: "50%", objectFit: "cover" }}
          />
        </div>

        {/* DROPDOWN */}
        {showDropdown && (
          <div style={{
            position: "absolute",
            top: "48px",
            right: "0",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            minWidth: "150px",
            zIndex: 999,
            overflow: "hidden",
          }}>
            <div
              onClick={handleLogout}
              style={{
                padding: "9px 16px",    
                fontSize: "13px",
                fontWeight: "600",
                color: "#e53e3e",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              Logout
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default Navbar;