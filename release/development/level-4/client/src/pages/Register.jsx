import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    user_role: "STUDENT",
    start_date: "",
    end_date: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      setError("Please provide both start date and end date.");
      return;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      setError("Please enter valid start and end dates.");
      return;
    }

    if (startDate > endDate) {
      setError("Start date cannot be after end date.");
      return;
    }

    if (formData.user_role === "STUDENT" && endDate < today) {
      setError("Students cannot have an end date in the past.");
      return;
    }

    if (formData.user_role === "ALUMNI" && endDate >= today) {
      setError("Alumni must have a completed (past) end date.");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword: _omitConfirmPassword, ...registerData } =
        formData;
      await register(registerData);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (value) => {
    setFormData((prev) => ({
      ...prev,
      user_role: value,
    }));
    setError("");
  };

  return (
    <div className="auth-container register-page">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-circle">AC</div>
          </div>
          <h1>Create Account</h1>
          <p>Join the Alumni College community</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="role-toggle">
            <span className="role-label">Account Type</span>
            <div className="role-options">
              {[
                {
                  label: "Student",
                  value: "STUDENT",
                  helper: "Currently studying",
                },
                {
                  label: "Alumni",
                  value: "ALUMNI",
                  helper: "Already graduated",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`role-option ${
                    formData.user_role === option.value ? "selected" : ""
                  }`}
                  onClick={() => handleRoleSelect(option.value)}
                  aria-pressed={formData.user_role === option.value}
                  disabled={loading}
                >
                  <span className="role-option-label">{option.label}</span>
                  <span className="role-option-helper">{option.helper}</span>
                </button>
              ))}
            </div>
            <p className="role-helper">
              {formData.user_role === "STUDENT"
                ? "Students need an expected graduation date that is today or later."
                : "Alumni should provide the date their programme finished."}
            </p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              type="tel"
              id="mobile_number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              placeholder="Enter mobile number"
              required
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Start Date</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>

      <div className="auth-illustration">
        <div className="illustration-content">
          <h2>Join Our Community</h2>
          <p>
            Register to access exclusive features and connect with your college
            network.
          </p>
          <div className="illustration-features">
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Create Your Profile</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Network with Peers</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Access Alumni Resources</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
