import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";

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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-80"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        <input
          name="username"
          placeholder="Username"
          className="border w-full p-2 rounded mb-3"
          value={form.username}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border w-full p-2 rounded mb-3"
          value={form.password}
          onChange={handleChange}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button className="bg-green-500 w-full text-white p-2 rounded hover:bg-green-600">
          Register
        </button>
        <p className="text-center mt-3 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;
