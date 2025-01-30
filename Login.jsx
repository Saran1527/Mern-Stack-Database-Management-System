import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image2 from '../asset/image2.jpg';
import './Login.css';

const Login = ({fetchEntries}) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Both fields are required!");
      return;
    }

    try {
      const url = isAdmin
        ? "http://localhost:5000/api/admin-login"
        : "http://localhost:5000/api/login";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.admin || data.user) {
          localStorage.setItem(
            isAdmin ? "admin" : "user",
            JSON.stringify(data.admin || data.user)
          );

          navigate(isAdmin ? "/details" : "/user-details");
        } else {
          setError("User data is missing from the response.");
        }
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${image2})`}}>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
      <h2 className="login-title">Login</h2>
        <div className="form-group"> 
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="form-input"
            required
          />
        </div>
       
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="form-input"
            required
          />
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
            />
            Admin Login
          </label>
        </div>
        <button type="submit" className="glow-on-hover">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
