import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Login button clicked");

    if (!username || !password) {
      alert("Please enter Username and Password");
      return;
    }

    try {

   const res = await axios.post(
  "http://127.0.0.1:8000/login",
  {
    username,
    password,
  }
);

      console.log(res.data);

      if (res.data.message === "Login Successful") {

        localStorage.setItem("user_id", res.data.user_id);
        localStorage.setItem("username", res.data.username);

        alert("Login Successful");

        navigate("/chat");

      } else {

        alert(res.data.message);

      }

    } catch (err) {

      console.log(err);

      alert("Unable to connect to server.");

    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="logo">🏦</div>

        <h1>BankAssist AI</h1>

        <p className="subtitle">
          Secure Banking Login
        </p>

        <form onSubmit={handleLogin}>

          <label>Username</label>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>

          <div className="password-box">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

          </div>

          <div className="remember">

            <label>
              <input type="checkbox" />
              Remember Me
            </label>

            <a href="#">Forgot Password?</a>

          </div>

          <button className="login-btn">
            Login
          </button>

        </form>

        <p className="register-link">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>

      </div>

    </div>
  );
}