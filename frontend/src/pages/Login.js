import "../login.css"; 
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import bg from '../images/image.png'; 
import axios from "axios";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");   // ← ADD THIS
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");   // ← clear previous error

    try {
      const res = await axios.post("http://127.0.0.1:8000/login", {
        email: email,
        password: password
      });

      if (res.data.success) {
        localStorage.setItem("medguide_username", res.data.username);
        navigate("/dashboard");
      } else {
        setError(res.data.message);   // ← instead of alert()
      }

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");   // ← instead of alert()
    }
  };

  return (
    <>
      <img src={bg} className="bg-img" alt="background" />

      <div className="login-container" style={{ paddingTop: "250px" }}>
        <div className="login-card">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>

            <div className="input-box">
              <i className="fa fa-envelope icon"></i>
              <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-box password-box">
              <i className="fa fa-lock icon"></i>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i 
                className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} eye`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            {/* ← ADD THIS ERROR MESSAGE */}
            {error && (
              <p style={{ color: "red", fontSize: "13px", marginBottom: "8px", textAlign: "center" }}>
                ⚠️ {error}
              </p>
            )}

            <button className="login-btn">Login to MedGuide</button>

          </form>

          <div className="extra-links" style={{ textAlign: "center" }}>
            <Link to="/register">Create new account</Link>
          </div>

          <div className="footer-text">
            <h4>Smart Medical Guidance</h4>
            <p>Upload prescriptions • Check symptoms • Learn medicines</p>
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;