import "../login.css"; 
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import bg from '../images/image.png'; 
import axios from "axios";

function Login() {

  // ✅ STATE (ONLY ONCE)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/login", {
        email: email,
        password: password
      });

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