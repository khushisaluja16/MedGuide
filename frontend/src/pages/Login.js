import "../login.css"; 
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from '../images/image.png'; 


function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await res.json();

      if (data.success) {
        navigate("/dashboard");;
      } else {
        alert(data.error);
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <>
      {/* Background */}
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

            <div className="input-box">
              <i className="fa fa-envelope icon"></i>
              <input 
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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