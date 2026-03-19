import React from "react";

import logo from "../images/logo.png";
import userImg from "../images/user.png";

function Navbar() {
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
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        
        <img
          src={logo}
          alt="MedGuide Logo"
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />

        <span style={{ fontSize: "19px", fontWeight: "600", color: "#2b7de9" }}>
          MedGuide
        </span>
      </div>

      {/* CENTER: NAV LINKS */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>

        <span style={{
          fontSize: "18px",
          fontWeight: "700",
          borderBottom: "3px solid #2b7de9",
          paddingBottom: "4px"
        }}>
          Dashboard
        </span>

        <div style={{
          width: "1px",
          height: "20px",
          background: "#aaa"
        }} />

        <span style={{
          fontSize: "17px",
          fontWeight: "500",
          color: "#444"
        }}>
          Reports
        </span>

        <div style={{
          width: "1px",
          height: "20px",
          background: "#aaa"
        }} />

        <span style={{
          fontSize: "17px",
          fontWeight: "500",
          color: "#444"
        }}>
          Profile
        </span>

      </div>

      {/* RIGHT: USER */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

        <span style={{ fontSize: "18px", fontWeight: "500", color: "#333" }}>
          Welcome, <b>User</b>
        </span>

        <img
          src={userImg}
          alt="User"
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />

      </div>

    </div>
  );
}

export default Navbar;