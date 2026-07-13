import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.username ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/register",
        {
          name: form.name,
          email: form.email,
          username: form.username,
          password: form.password,
        }
      );

      alert(res.data.message);

      navigate("/");

    } catch (err) {

      console.log(err);

      if (err.response) {
        alert(err.response.data.message || JSON.stringify(err.response.data));
      } else {
        alert(err.message);
      }

    }
  };

  return (
    <div className="register-container">

      <div className="register-card">

        <div className="logo">
          🏦
        </div>

        <h1>BankAssist AI</h1>

        <p>Create Your Account</p>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Full Name"
            name="name"
            onChange={handleChange}
          />

          <input
            type="email"
            placeholder="Email Address"
            name="email"
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
          />

          <div className="password-box">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️‍🗨️" : "👁️"}
            </button>

          </div>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
          />

          <button className="register-btn">
            Register
          </button>

        </form>

        <p className="login-link">
          Already have an account?
          <Link to="/"> Login</Link>
        </p>

      </div>

    </div>
  );
}