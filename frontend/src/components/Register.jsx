import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";
import "./Register.css"; // CHANGED FROM RegisterUnique.css

function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await registerUser(form);
      localStorage.setItem("token", res.data.access_token);
      navigate("/productlist");
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="unique-register-container">
      <div className="unique-register-backdrop"></div> 

      <form onSubmit={handleSubmit} className="unique-register-form-card">
        <h2 className="unique-register-title">
          <span role="img" aria-label="sprout">🌱</span> Create Your Account
        </h2>
        <p className="unique-register-subtitle">
          Join our community and discover amazing products.
        </p>

        <div className="unique-input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Choose a username"
            value={form.username}
            onChange={handleChange}
            className="unique-input-field"
          />
        </div>

        <div className="unique-input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={handleChange}
            className="unique-input-field"
          />
        </div>

        {error && (
          <div className="unique-error-message">
            {error}
          </div>
        )}

        <button type="submit" className="unique-submit-button">
          Sign Up Now
        </button>

        <p className="unique-login-prompt">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="unique-login-link"
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;