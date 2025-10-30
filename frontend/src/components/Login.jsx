import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import "./Register.css"; // Assuming you are using Register.css for shared unique styles

function Login() {
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
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.access_token);
      navigate("/products");
    } catch (err) {
      console.error("Login error:", err.response?.data);
      setError(err.response?.data?.detail || "Invalid username or password");
    }
  };

  return (
    // Use the unique container and backdrop classes
    <div className="unique-register-container"> 
      <div className="unique-register-backdrop"></div> 

      {/* Use the unique form card class */}
      <form onSubmit={handleSubmit} className="unique-register-form-card">
        
        {/* Title and Subtitle */}
        <h2 className="unique-register-title">
          Welcome Back <span role="img" aria-label="waving hand">👋</span>
        </h2>
        <p className="unique-register-subtitle">
          Please log in to access your account
        </p>

        {/* Username Input */}
        <div className="unique-input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={form.username}
            onChange={handleChange}
            className="unique-input-field" // Use the unique input style
          />
        </div>

        {/* Password Input */}
        <div className="unique-input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className="unique-input-field" // Use the unique input style
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="unique-error-message">
            {error}
          </div>
        )}

        {/* Log In Button */}
        <button
          type="submit"
          className="unique-submit-button" // Use the unique button style
        >
          Log In
        </button>

        {/* Registration Prompt */}
        <p className="unique-login-prompt">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="unique-login-link" // Use the unique link style
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;