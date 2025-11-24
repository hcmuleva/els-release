# 📘 Lesson 3.8 - Protected Routes & User Profile

**Duration:** 45 minutes  
**Difficulty:** Advanced

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

- ✅ Create protected route components
- ✅ Redirect unauthenticated users to login
- ✅ Build user profile page
- ✅ Implement profile editing
- ✅ Add logout functionality
- ✅ Complete the full authentication flow

---

## 🔒 What are Protected Routes?

**Protected Routes** = Pages that require login

**Examples:**

- ✅ `/profile` - Only logged-in users
- ✅ `/dashboard` - Only logged-in users
- ✅ `/users` - Only logged-in users
- ❌ `/` - Public (everyone)
- ❌ `/login` - Public
- ❌ `/register` - Public

---

## 🛡️ Creating ProtectedRoute Component

```jsx
// 🔬 COPY THIS - src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected page
  return children;
}

export default ProtectedRoute;
```

**How it works:**

1. Check if user is authenticated
2. If yes → Show the page
3. If no → Redirect to `/login`

---

## 🔧 Using ProtectedRoute in App.jsx

```jsx
// 🔬 UPDATE THIS - src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import "./styles/App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

**Now `/profile` and `/users` require login!** 🎉

---

## 👤 Building Profile Page

```jsx
// 🔬 COPY THIS - src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser, updateProfile } from "../services/api";
import "../styles/Profile.css";

function Profile() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Load full user data
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      await updateProfile({
        id: user.id,
        ...profileData,
      });

      setMessage("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      setMessage("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    setProfileData({
      username: user.username || "",
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    });
    setEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-card">
          <h1>My Profile</h1>

          {message && (
            <div
              className={`message ${
                message.includes("Error") ? "error" : "success"
              }`}
            >
              {message}
            </div>
          )}

          <div className="profile-content">
            {editing ? (
              // Edit mode
              <>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleChange}
                    disabled // Strapi doesn't allow changing username
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div className="button-group">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-save"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={handleCancel} className="btn-cancel">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              // View mode
              <>
                <div className="profile-info">
                  <div className="info-item">
                    <label>Username</label>
                    <p>{user?.username}</p>
                  </div>

                  <div className="info-item">
                    <label>Email</label>
                    <p>{user?.email}</p>
                  </div>

                  <div className="info-item">
                    <label>First Name</label>
                    <p>{profileData.firstName || "Not set"}</p>
                  </div>

                  <div className="info-item">
                    <label>Last Name</label>
                    <p>{profileData.lastName || "Not set"}</p>
                  </div>

                  <div className="info-item">
                    <label>Account ID</label>
                    <p>{user?.id}</p>
                  </div>
                </div>

                <div className="button-group">
                  <button onClick={() => setEditing(true)} className="btn-edit">
                    Edit Profile
                  </button>
                  <button onClick={logout} className="btn-logout">
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
```

---

### Profile.css

```css
/* 🔬 COPY THIS - src/styles/Profile.css */
.profile-page {
  min-height: calc(100vh - 200px);
  padding: 3rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.profile-card {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.profile-card h1 {
  text-align: center;
  color: #2d3748;
  margin-bottom: 2rem;
}

.message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
}

.message.success {
  background: #c6f6d5;
  color: #22543d;
}

.message.error {
  background: #fed7d7;
  color: #742a2a;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item label {
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.info-item p {
  color: #2d3748;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f7fafc;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-edit,
.btn-save,
.btn-cancel,
.btn-logout {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit,
.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-edit:hover,
.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-cancel {
  background: #e2e8f0;
  color: #2d3748;
}

.btn-cancel:hover {
  background: #cbd5e0;
}

.btn-logout {
  background: #f56565;
  color: white;
}

.btn-logout:hover {
  background: #e53e3e;
  transform: translateY(-2px);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

---

## 🧭 Update Navigation

```jsx
// 🔬 UPDATE THIS - src/components/Layout.jsx (navigation part)
import { useAuth } from "../context/AuthContext";

function Layout() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">🎓 College Kit</h1>
          </div>

          <nav className="nav">
            <NavLink to="/">Home</NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/users">Users</NavLink>
                <NavLink to="/profile">Profile</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </nav>

          {isAuthenticated && (
            <div className="user-info">
              <span>Welcome, {user?.username}!</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
```

---

## 🧪 Testing Complete Flow

### Test 1: Register → Profile

1. Go to `/register`
2. Create account
3. Should redirect to `/profile`
4. Should see your profile data

### Test 2: Logout → Try Protected Route

1. Click Logout
2. Try to visit `/profile`
3. Should redirect to `/login`

### Test 3: Login → Dashboard

1. Login with credentials
2. Should redirect to `/profile`
3. Can navigate to `/users`

### Test 4: Refresh Page

1. While logged in, refresh page
2. Should stay logged in (localStorage!)

---

## 🎨 Practice Tasks

### Task 1: Add "Remember Me"

Add checkbox to save login for 30 days vs 1 day.

### Task 2: Password Change

Add form to update password.

### Task 3: Account Deletion

Add button to delete account with confirmation.

### Task 4: Profile Picture

Add avatar upload using Strapi media library.

---

## 🔑 Key Concepts

| Concept             | Description                                  |
| ------------------- | -------------------------------------------- |
| **Protected Route** | Route that requires authentication           |
| **Navigate**        | Redirect component from react-router-dom     |
| **localStorage**    | Persist authentication across page refreshes |
| **Bearer Token**    | JWT sent in Authorization header             |
| **CRUD Profile**    | View and edit user data                      |

---

## 📚 Summary - Complete Auth Flow

```
1. User registers → POST /api/auth/local/register
2. Backend returns JWT + user data
3. Frontend saves to localStorage
4. User navigates to protected route
5. ProtectedRoute checks isAuthenticated
6. If true → show page
7. If false → redirect to /login
8. User can edit profile → PUT /api/users/:id (with token)
9. User logs out → clear localStorage
10. Redirect to home
```

---

## ✅ Checklist - Level 3 Complete!

Before moving to Level 4, make sure you can:

- [ ] Explain Context API and avoid props drilling
- [ ] Build REST APIs with Express.js
- [ ] Perform CRUD operations
- [ ] Set up Strapi CMS
- [ ] Create collections and add content
- [ ] Implement registration and login
- [ ] Store JWT tokens in localStorage
- [ ] Create protected routes
- [ ] Build profile page with edit functionality
- [ ] Test complete authentication flow

---

## 🎯 What's Next?

In **Level 4**, you'll add:

- 🔥 Real-time features with WebSockets
- 🔥 Advanced state management
- 🔥 File uploads
- 🔥 Deployment to production

---

## 🎓 Congratulations!

**You've completed Level 3!** 🎉

You now know how to:

- Build full-stack applications
- Implement authentication
- Use Strapi CMS
- Create protected routes
- Manage global state with Context

**You're ready for Level 4!** 🚀

---

## 📖 Additional Resources

- [React Context API](https://react.dev/reference/react/useContext)
- [Strapi Documentation](https://docs.strapi.io)
- [JWT Introduction](https://jwt.io/introduction)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

**Amazing work!** Ready for real-time features? See you in [Level 4](../../level-4/README.md)! 🚀
