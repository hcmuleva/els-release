# 📘 Lesson 3.1 - Context API & Global State Management

**Duration:** 30 minutes  
**Difficulty:** Intermediate

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

- ✅ Understand what Context API is and why we need it
- ✅ Learn the problem of "props drilling"
- ✅ Create a Context Provider component
- ✅ Use `useContext` hook to access global state
- ✅ Build a theme switcher with Context
- ✅ Build an authentication context (foundation for later)

---

## 🤔 What is Props Drilling?

### The Problem

Imagine you have deeply nested components that need the same data:

```
App (has user data)
 └── Dashboard
      └── Sidebar
           └── UserMenu (needs user data)
```

**Without Context**, you must pass props through every level:

```jsx
// ❌ Props Drilling - Passing props through every level
function App() {
  const user = { name: "Alice", role: "Student" };

  return <Dashboard user={user} />;
}

function Dashboard({ user }) {
  // Dashboard doesn't use user, just passes it down
  return <Sidebar user={user} />;
}

function Sidebar({ user }) {
  // Sidebar doesn't use user either, just passes it down
  return <UserMenu user={user} />;
}

function UserMenu({ user }) {
  // Finally! UserMenu actually uses the user data
  return <div>Welcome, {user.name}!</div>;
}
```

This is **annoying** and **hard to maintain**! 😫

---

## 💡 The Solution: Context API

**Context API** lets you share data **globally** without passing props through every level.

```
App (provides user data via Context)
 └── Dashboard
      └── Sidebar
           └── UserMenu (reads from Context directly)
```

**With Context**:

```jsx
// ✅ Context API - Direct access, no props drilling!
function App() {
  const user = { name: "Alice", role: "Student" };

  return (
    <UserContext.Provider value={user}>
      <Dashboard />
    </UserContext.Provider>
  );
}

function Dashboard() {
  // No props needed!
  return <Sidebar />;
}

function Sidebar() {
  // No props needed!
  return <UserMenu />;
}

function UserMenu() {
  // Access user directly from Context!
  const user = useContext(UserContext);
  return <div>Welcome, {user.name}!</div>;
}
```

**Much cleaner!** 🎉

---

## 🛠️ How Context API Works

### Three Key Parts:

1. **Create Context** - Define the context
2. **Provider** - Wrap components that need the data
3. **Consumer** - Use `useContext` to read the data

---

## 📝 Example 1: Simple Theme Context

Let's build a theme switcher (Light/Dark mode).

### Step 1: Create the Context

```jsx
// 🔬 COPY THIS - src/context/ThemeContext.jsx
import { createContext, useState } from "react";

// 1. Create the Context
export const ThemeContext = createContext();

// 2. Create the Provider Component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // The value object contains everything we want to share
  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
```

**What's happening?**

- `createContext()` - Creates a new context
- `ThemeProvider` - Component that wraps your app
- `value` prop - The data we're sharing
- `{children}` - All child components

---

### Step 2: Wrap Your App with the Provider

```jsx
// 🔬 COPY THIS - src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
```

**Now every component inside `<App />` can access the theme!**

---

### Step 3: Use the Context in Components

```jsx
// 🔬 COPY THIS - src/components/Header.jsx
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function Header() {
  // 3. Use the Context with useContext hook
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header
      style={{
        background: theme === "light" ? "#fff" : "#333",
        color: theme === "light" ? "#000" : "#fff",
      }}
    >
      <h1>College Kit</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>
    </header>
  );
}

export default Header;
```

**No props needed!** The Header directly accesses theme from Context.

---

## 📝 Example 2: Authentication Context

This is the **most important** pattern for Level 3. We'll use it for login/logout.

### Step 1: Create Auth Context

```jsx
// 🔬 COPY THIS - src/context/AuthContext.jsx
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // State: current user and login status
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function: Login
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Later: save token to localStorage
  };

  // Function: Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Later: remove token from localStorage
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
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

**Key Features:**

- Stores `user` and `isAuthenticated` state
- Provides `login()` and `logout()` functions
- Custom `useAuth()` hook for convenience

---

### Step 2: Wrap App with AuthProvider

```jsx
// 🔬 COPY THIS - src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
```

---

### Step 3: Use Auth in Components

```jsx
// 🔬 COPY THIS - Example Login Page
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate login (later we'll call real API)
    const userData = {
      id: 1,
      name: "Alice Johnson",
      email: email,
      role: "Student",
    };

    login(userData);
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
```

---

```jsx
// 🔬 COPY THIS - Example Header with Auth
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header>
      <h1>College Kit</h1>
      {isAuthenticated ? (
        <div>
          <span>Welcome, {user.name}!</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => navigate("/login")}>Login</button>
      )}
    </header>
  );
}

export default Header;
```

**Beautiful!** Any component can access auth state without props! 🎉

---

## 🎨 Practice Exercise: Counter Context

Build a global counter that can be incremented from any component.

```jsx
// 🔬 COPY THIS - Create this in practice lab
import { createContext, useState, useContext } from "react";

const CounterContext = createContext();

export function CounterProvider({ children }) {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  const value = { count, increment, decrement, reset };

  return (
    <CounterContext.Provider value={value}>{children}</CounterContext.Provider>
  );
}

export function useCounter() {
  return useContext(CounterContext);
}
```

**Usage:**

```jsx
// Component A
function ComponentA() {
  const { count, increment } = useCounter();
  return (
    <div>
      <h2>Component A</h2>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

// Component B (different part of app)
function ComponentB() {
  const { count, decrement } = useCounter();
  return (
    <div>
      <h2>Component B</h2>
      <p>Count: {count}</p>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}
```

Both components share the **same count**! 🎯

---

## 🔑 Key Concepts

### 1. When to Use Context?

**✅ Good Use Cases:**

- Authentication state (user, login, logout)
- Theme preferences (light/dark mode)
- Language/locale settings
- Shopping cart data
- Notification system

**❌ Don't Use for:**

- Passing props just 1-2 levels down (use regular props)
- Frequently changing data (can cause performance issues)
- Simple local component state

---

### 2. Context Best Practices

✅ **Create custom hooks** - `useAuth()` is easier than `useContext(AuthContext)`  
✅ **One context per concern** - Separate ThemeContext, AuthContext, etc.  
✅ **Keep context small** - Don't put everything in one giant context  
✅ **Provide defaults** - Handle cases where Provider is missing

---

## 📊 Context Flow Diagram

```
┌─────────────────────────────────┐
│     main.jsx (Root)             │
│  <AuthProvider>                 │
│    <App />                      │
│  </AuthProvider>                │
└────────┬────────────────────────┘
         │
         ├─────────────────────────┐
         │                         │
    ┌────▼─────┐            ┌──────▼──────┐
    │  Login   │            │   Header    │
    │          │            │             │
    │ useAuth()│            │  useAuth()  │
    │ - login()│            │  - user     │
    └──────────┘            │  - logout() │
                            └─────────────┘

All components access the same auth state!
```

---

## 🧪 Practice Tasks

Try these in the Practice Lab:

### Task 1: Theme Switcher

- Create ThemeContext with light/dark themes
- Add toggle button in Header
- Change background colors based on theme

### Task 2: User Preferences

- Create PreferencesContext
- Store user's name and favorite color
- Display personalized greeting

### Task 3: Shopping Cart (Advanced)

- Create CartContext
- Add `items` array state
- Create `addItem`, `removeItem`, `clearCart` functions
- Show cart count in header

---

## 📚 Summary

| Concept            | Description                              |
| ------------------ | ---------------------------------------- |
| **Context**        | Global state container                   |
| **Provider**       | Component that shares the state          |
| **useContext**     | Hook to access context data              |
| **Props Drilling** | Passing props through many levels (bad!) |
| **Custom Hook**    | Wrapper like `useAuth()` for easy access |

---

## ✅ Checklist

Before moving to Lesson 3.2, make sure you can:

- [ ] Explain what props drilling is
- [ ] Create a Context with `createContext()`
- [ ] Build a Provider component with state
- [ ] Use `useContext()` to read context values
- [ ] Create a custom hook like `useAuth()`
- [ ] Wrap your app with multiple providers

---

## 🎯 What's Next?

In **Lesson 3.2**, we'll learn about REST APIs and build our first Express.js server!

You'll learn:

- What is an API?
- HTTP methods (GET, POST, PUT, DELETE)
- Building a Node.js Express server
- Creating API routes

---

## 🔗 Additional Resources

- [React Docs - Context](https://react.dev/reference/react/useContext)
- [React Docs - createContext](https://react.dev/reference/react/createContext)
- [When to use Context](https://react.dev/learn/passing-data-deeply-with-context)

---

**You've mastered Context API!** 🎉 Ready to build APIs? Continue to [Lesson 3.2](lesson-3.2-rest-apis.md)!
