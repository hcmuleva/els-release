import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
    setLoading(true);

    try {
      await login(formData.identifier, formData.password);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-circle">AC</div>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your Alumni College account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="identifier">Username or Email</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your username or email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>

      <div className="auth-illustration">
        <div className="illustration-content">
          <h2>Alumni College Portal</h2>
          <p>
            Connect with fellow students and alumni. Track your academic journey
            and stay connected with your college community.
          </p>
          <div className="illustration-features">
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Connect with Alumni</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Track Student Progress</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Manage Your Profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
