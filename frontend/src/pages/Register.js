import bg from '../images/image.png';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Account created successfully! Please login.");
        navigate("/");
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <>
      <img src={bg} className="bg-img" alt="background" />

      <div className="login-container">
        <div className="login-card">
          <h2>Create Account</h2>

          <form onSubmit={handleRegister}>

            <div className="input-box">
              <i className="fa fa-user icon"></i>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-box">
              <i className="fa fa-envelope icon"></i>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-box password-box">
              <i className="fa fa-lock icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} eye`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="input-box password-box">
              <i className="fa fa-lock icon"></i>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i
                className={`fa ${showConfirm ? "fa-eye-slash" : "fa-eye"} eye`}
                onClick={() => setShowConfirm(!showConfirm)}
              ></i>
            </div>

            <button className="login-btn">Create Account</button>

          </form>

          <div className="extra-links">
            <span
              onClick={() => navigate("/")}
              style={{ cursor: "pointer", color: "#1a73e8" }}
            >
              ← Already have an account? Login
            </span>
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

export default Register;