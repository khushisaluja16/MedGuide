import bg from '../images/image.png';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();


  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    console.log("Register clicked"); // ✅ DEBUG

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/register", {
        username,
        email,
        password
      });

      console.log(res.data);

      if (res.data.success) {
        navigate("/dashboard");
      } else {
        alert(res.data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <>
      <img src={bg} className="bg-img" alt="background" />

      <div className="login-container">
        <div className="login-card">
          <h2>Create Account</h2>

          <form>

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

            <button
              type="button"
              className="login-btn"
              onClick={handleRegister}
            >
              Create Account
            </button>

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