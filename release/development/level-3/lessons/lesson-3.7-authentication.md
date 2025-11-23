# 📘 Lesson 3.7 - Authentication System (Register & Login)

**Duration:** 60 minutes  
**Difficulty:** Advanced

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

- ✅ Understand JWT (JSON Web Tokens) authentication
- ✅ Build Register page with validation
- ✅ Build Login page with authentication
- ✅ Store JWT tokens in localStorage
- ✅ Update AuthContext to persist login
- ✅ Send authenticated requests to backend
- ✅ Handle authentication errors

---

## 🔐 What is Authentication?

**Authentication** = Verifying "who you are"

### The Flow:

```
1. User enters email/password → Frontend
2. Frontend sends to backend
3. Backend checks database
4. If valid → Backend sends JWT token
5. Frontend stores token
6. Frontend sends token with every request
7. Backend verifies token → Grants access
```

---

## 🎫 What is a JWT Token?

**JWT** = JSON Web Token

A secure string that proves you're logged in.

**Example JWT:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbGljZUBjb2xsZWdlLmVkdSJ9.abc123def456
```

**Parts:**

1. Header (algorithm)
2. Payload (user data: id, email)
3. Signature (secret key)

**You can't fake it!** Only the server can create valid tokens.

---

## 🛠️ Strapi Built-in Authentication

Good news! **Strapi has authentication built-in!**

### Strapi Auth Endpoints:

| Endpoint                   | Method | Purpose               |
| -------------------------- | ------ | --------------------- |
| `/api/auth/local/register` | POST   | Create account        |
| `/api/auth/local`          | POST   | Login (get JWT token) |
| `/api/users/me`            | GET    | Get current user info |

---

## 📝 Building Register Page

### Step 1: Create Register Form

```jsx
// 🔬 COPY THIS - src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    gender: "",
    age: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Register with Strapi
      const response = await fetch(
        "http://localhost:1337/api/auth/local/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Registration failed");
      }

      // Strapi returns: { jwt, user }
      const { jwt, user } = data;

      // Save token and user to AuthContext
      login(user, jwt);

      // Redirect to profile or home
      navigate("/profile");
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <h1>Create Account</h1>
          <p className="subtitle">Join our college community</p>

          {errors.general && (
            <div className="error-banner">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? "error" : ""}
                />
                {errors.username && (
                  <span className="error-msg">{errors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <span className="error-msg">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? "error" : ""}
                />
                {errors.firstName && (
                  <span className="error-msg">{errors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? "error" : ""}
                />
                {errors.lastName && (
                  <span className="error-msg">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
              />
              {errors.password && (
                <span className="error-msg">{errors.password}</span>
              )}
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="footer-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
```

---

## 🔑 Building Login Page

```jsx
// 🔬 COPY THIS - src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    identifier: "", // Strapi uses "identifier" for email/username
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      setErrors({ general: "Please fill in all fields" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Login failed");
      }

      const { jwt, user } = data;

      // Save to AuthContext
      login(user, jwt);

      // Redirect
      navigate("/profile");
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1>Welcome Back!</h1>
          <p className="subtitle">Sign in to your account</p>

          {errors.general && (
            <div className="error-banner">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email or Username</label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="footer-text">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
```

---

## 🔄 Update AuthContext with localStorage

```jsx
// 🔬 UPDATE THIS - src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    // Save to state
    setUser(userData);
    setToken(jwtToken);
    setIsAuthenticated(true);

    // Save to localStorage
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

---

## 🔒 Making Authenticated API Requests

```javascript
// 🔬 UPDATE THIS - src/services/api.js
const STRAPI_URL = "http://localhost:1337/api";

// Helper to get token from localStorage
const getToken = () => localStorage.getItem("token");

// GET with authentication
export const getCurrentUser = async () => {
  const token = getToken();

  const response = await fetch(`${STRAPI_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

// POST with authentication
export const updateProfile = async (userData) => {
  const token = getToken();

  const response = await fetch(`${STRAPI_URL}/users/${userData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  return data;
};
```

---

## 🧪 Testing Authentication

### Test Flow:

1. **Start Strapi:** `npm run develop`
2. **Start React:** `npm run dev`
3. **Navigate to Register:** `http://localhost:5173/register`
4. **Fill form and submit**
5. **Check browser DevTools → Application → Local Storage**
   - Should see `token` and `user`
6. **Logout and login again**
7. **Token should persist across refreshes**

---

## 🔑 Key Concepts

| Concept           | Description                             |
| ----------------- | --------------------------------------- |
| **JWT**           | JSON Web Token for authentication       |
| **Bearer Token**  | Format: `Authorization: Bearer <token>` |
| **localStorage**  | Browser storage for persisting data     |
| **Protected API** | Requires token in headers               |
| **Strapi Auth**   | Built-in authentication endpoints       |

---

## ✅ Checklist

Before moving to Lesson 3.6, make sure you can:

- [ ] Explain how JWT authentication works
- [ ] Build register form with validation
- [ ] Build login form and handle errors
- [ ] Save JWT token to localStorage
- [ ] Send authenticated requests with Bearer token
- [ ] Handle login state persistence

---

## 🎯 What's Next?

In **Lesson 3.6**, we'll create **protected routes** and a user profile page!

---

**You've mastered authentication!** 🎉 Continue to [Lesson 3.6](lesson-3.6-protected-routes.md)!
