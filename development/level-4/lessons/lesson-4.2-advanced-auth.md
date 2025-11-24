# Lesson 4.2 - Advanced Authentication Flow

**Duration**: 60 minutes  
**Difficulty**: Intermediate

---

## 🎯 Learning Objectives

1. ✅ Connect login/register forms to Strapi API
2. ✅ Auto-fetch user data after successful login
3. ✅ Implement token refresh mechanism
4. ✅ Create AuthContext for global auth state
5. ✅ Build role-based redirects
6. ✅ Add "Remember Me" functionality

---

## 🏗️ Understanding the Auth Flow

### Level 6's Authentication Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Login     │─────▶│    Auth     │─────▶│   Strapi    │
│   Form      │      │  Service    │      │   Backend   │
└─────────────┘      └─────────────┘      └─────────────┘
       │                    │                     │
       │                    ▼                     │
       │             Store JWT Token              │
       │                    │                     │
       │                    ▼                     │
       │             Fetch Full User ◀────────────┘
       │                    │
       │                    ▼
       │             AuthContext
       │                    │
       │                    ▼
       └──────────▶   Redirect Home
```

### Why Auto-Fetch User Data?

**Problem**: Strapi's `/auth/local` login endpoint returns **minimal user data**:
```json
{
  "jwt": "token123",
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com"
    // Missing: first_name, last_name, mobile, dates, etc.
  }
}
```

**Solution**: After login, immediately call `/users/me` to get **complete user object**:
```json
{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "mobile_number": "1234567890",
  "user_role": "STUDENT",
  "start_date": "2020-08-01",
  "end_date": "2024-05-31"
  // All fields present!
}
```

---

## 🔐 Step 1: Explore the API Service Layer

Level 6 already has `service/api.js` - let's examine it:

```javascript
// service/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Request interceptor - Auto-inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response.data, // Unwrap Strapi response
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Key Features

1. **Auto Token Injection**: Every request includes `Authorization: Bearer <token>`
2. **Response Unwrapping**: Returns `response.data` instead of full Axios response
3. **401 Handling**: Auto-logout on expired tokens
4. **Centralized Config**: Base URL from environment variables

---

## 🔑 Step 2: Understand the Auth Service

Examine `service/auth/authService.js`:

```javascript
import api from "../api.js";

/**
 * Login user with Strapi
 * CRITICAL: Auto-fetch full user data after login!
 */
export const login = async (identifier, password) => {
  try {
    // Step 1: Get JWT token
    const response = await api.post("/auth/local", {
      identifier,
      password,
    });

    // Step 2: Store token
    localStorage.setItem("token", response.jwt);

    // Step 3: Fetch full user data (IMPORTANT!)
    const user = await getCurrentUser();

    return { jwt: response.jwt, user };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Get current authenticated user
 * Returns COMPLETE user object with all Strapi fields
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/users/me");

    // Compute effective role based on dates
    const today = new Date();
    const endDate = response.end_date ? new Date(response.end_date) : null;
    
    let effectiveRole = response.user_role;
    if (response.user_role === "STUDENT" && endDate && endDate < today) {
      effectiveRole = "ALUMNI";
    }

    const user = {
      ...response,
      effective_role: effectiveRole,
      display_role: effectiveRole,
    };

    // Store in localStorage for persistence
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
};

/**
 * Register new user
 */
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/local/register", userData);
    return response;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

/**
 * Logout user - clear all stored data
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
```

### Why This Pattern Works

✅ **Separation of Concerns**: Auth logic in service layer, not in components  
✅ **Reusability**: Can call these functions from anywhere  
✅ **Testability**: Pure functions, easy to unit test  
✅ **Type Safety**: Clear input/output contracts  

---

## 🌍 Step 3: Explore AuthContext

Open `src/context/AuthContext.jsx`:

```jsx
import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../../service/auth/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Fetch fresh user data from API
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Auth init error:", error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 🔑 Login function
  const login = async (identifier, password) => {
    try {
      const { user: userData } = await authService.login(identifier, password);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // 📝 Register function
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 🚪 Logout function
  const logout = () => {
    setUser(null);
    authService.logout();
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for easy access
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

### Context Pattern Benefits

✅ **Global State**: Auth available anywhere in component tree  
✅ **Automatic Refresh**: Rehydrates from localStorage on mount  
✅ **Custom Hook**: Clean API with `useAuth()`  
✅ **Loading State**: Prevents flash of wrong UI  

---

## 📝 Step 4: Examine Login Component

Open `src/pages/Login.jsx` to see how it uses AuthContext:

```jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call AuthContext login (which calls authService.login)
      const user = await login(formData.identifier, formData.password);
      
      // Role-based redirect
      if (user.effective_role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email or Username</label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
```

### Component Pattern

✅ **Controlled Form**: All inputs use `value` + `onChange`  
✅ **Loading State**: Disable button during API call  
✅ **Error Display**: Show server errors inline  
✅ **Role-Based Redirect**: Different routes for different roles  
✅ **No UI Library**: Pure HTML + CSS  

---

## 🛡️ Step 5: Understand Protected Routes

Open `src/routes/ProtectedRoute.jsx`:

```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check admin role if required
  if (adminOnly && user.effective_role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

### Route Protection Pattern

```jsx
// In src/routes/index.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="members" element={<Members />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin-only routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

---

## 🎯 Step 6: Test the Auth Flow

### Manual Testing Checklist

1. **Register Flow**
   ```
   ✅ Navigate to /register
   ✅ Fill form with valid data
   ✅ Submit form
   ✅ Check success message
   ✅ Navigate to /login
   ```

2. **Login Flow**
   ```
   ✅ Enter credentials
   ✅ Click Login
   ✅ Check localStorage has "token"
   ✅ Check localStorage has "user" with all fields
   ✅ Redirect to home page
   ✅ Header shows username
   ```

3. **Protected Route**
   ```
   ✅ Clear localStorage (logout)
   ✅ Try to visit /members directly
   ✅ Should redirect to /login
   ```

4. **Logout Flow**
   ```
   ✅ Click Logout button
   ✅ localStorage cleared
   ✅ Redirect to /login
   ✅ Cannot access protected routes
   ```

### Browser DevTools Check

Open **Application > Local Storage**:

```json
// After login, you should see:
token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

user: {
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "mobile_number": "1234567890",
  "user_role": "STUDENT",
  "effective_role": "STUDENT",
  "display_role": "STUDENT",
  "start_date": "2020-08-01",
  "end_date": "2024-05-31"
}
```

---

## 🚀 Step 7: Add "Remember Me" (Optional)

### Simple Implementation

```jsx
// In Login.jsx
const [rememberMe, setRememberMe] = useState(false);

// Add checkbox to form
<div className="form-group checkbox-group">
  <label>
    <input
      type="checkbox"
      checked={rememberMe}
      onChange={(e) => setRememberMe(e.target.checked)}
    />
    Remember Me
  </label>
</div>

// In handleSubmit, after successful login:
if (rememberMe) {
  localStorage.setItem("rememberMe", "true");
} else {
  sessionStorage.setItem("token", response.jwt);
  sessionStorage.setItem("user", JSON.stringify(user));
}
```

### Advanced: Token Expiry

```javascript
// In authService.js
export const setToken = (token, remember = false) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("token", token);
  
  // Set expiry timestamp (7 days)
  const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
  storage.setItem("tokenExpiry", expiry);
};

export const isTokenExpired = () => {
  const expiry = localStorage.getItem("tokenExpiry") || 
                 sessionStorage.getItem("tokenExpiry");
  return Date.now() > parseInt(expiry);
};
```

---

## 📊 Comparison: With vs Without Auto-Fetch

### ❌ Without Auto-Fetch (Bad)

```jsx
// Only store login response user
const { jwt, user } = await api.post("/auth/local", { identifier, password });
setUser(user); // Missing fields!

// Later in Profile page:
<input value={user.first_name} /> // undefined!
<input value={user.mobile_number} /> // undefined!
```

### ✅ With Auto-Fetch (Good)

```jsx
// Store token, then fetch full user
const { jwt } = await api.post("/auth/local", { identifier, password });
localStorage.setItem("token", jwt);

const fullUser = await api.get("/users/me"); // All fields!
setUser(fullUser);

// Later in Profile page:
<input value={user.first_name} /> // "John" ✅
<input value={user.mobile_number} /> // "1234567890" ✅
```

---

## 🧠 Key Takeaways

1. ✅ **Service Layer**: Keep API calls in `service/`, not components
2. ✅ **Auto-Fetch**: Always get full user data after login
3. ✅ **Context API**: Global auth state with `useAuth()` hook
4. ✅ **Interceptors**: Auto-inject tokens, handle 401 errors
5. ✅ **Protected Routes**: Check `isAuthenticated` before rendering
6. ✅ **Role Computation**: Calculate `effective_role` from dates
7. ✅ **localStorage**: Persist token and user across sessions

---

## 🎯 Practice Exercise

### Task: Add Password Reset Flow

1. Create `service/auth/resetPassword.js`
2. Add `requestReset(email)` function
3. Add `resetPassword(code, newPassword)` function
4. Create `ForgotPassword.jsx` page
5. Add route in `routes/index.jsx`

### Bonus: Add Email Verification

1. After registration, show "Check your email" message
2. Create `/verify-email/:token` route
3. Call Strapi email confirmation endpoint
4. Redirect to login on success

---

## 📚 Next Lesson

**[Lesson 3: Ably Real-Time Client](./lesson-3-ably-client.md)** - Learn WebSocket pub/sub for live updates!

---

**You've mastered authentication!** 🎉 Next, we'll add real-time features with Ably.
