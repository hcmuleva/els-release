# 📘 Lesson 2.4 - React Router & Navigation

## 🎯 Learning Objectives

By the end of this lesson, you will understand:

- What React Router is and why we need it
- Setting up React Router in a React app
- Creating multiple pages (routes)
- Navigating between pages
- Using Link vs anchor tags
- URL parameters and dynamic routes
- useNavigate hook for programmatic navigation

---

## 🤔 What is React Router?

**React Router** enables navigation between different "pages" in a single-page React application.

### The Problem

React apps are **single-page applications** (SPAs):

- Only one HTML file (`index.html`)
- JavaScript changes what you see
- No traditional page reloads
- URL doesn't change automatically

### The Solution

React Router provides:

- ✅ URL-based navigation (`/`, `/login`, `/register`)
- ✅ Back/Forward browser buttons work
- ✅ Bookmarkable URLs
- ✅ No page reloads (fast!)

---

## 📦 Installing React Router

```bash
npm install react-router-dom
```

**Version:** We'll use React Router v6+ (latest)

---

## 🏗️ Basic Setup

### Step 1: Import Router Components

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
```

### Step 2: Wrap Your App

```jsx
// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

### Step 3: Define Routes in App.jsx

```jsx
// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
```

**🔬 Try in Practice Lab** ⬆️

---

## 📄 Creating Page Components

### Home Page

```jsx
// pages/Home.jsx
function Home() {
  return (
    <div className="container">
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
    </div>
  );
}

export default Home;
```

### About Page

```jsx
// pages/About.jsx
function About() {
  return (
    <div className="container">
      <h1>About Page</h1>
      <p>This is the about page.</p>
    </div>
  );
}

export default About;
```

**🔬 Try in Practice Lab** ⬆️

**Test:** Navigate to `http://localhost:5173/` and `http://localhost:5173/about`

---

## 🔗 Navigation with Link

### ❌ Don't Use Anchor Tags

```jsx
// ❌ WRONG - Causes full page reload
<a href="/about">About</a>
```

### ✅ Use Link Component

```jsx
import { Link } from "react-router-dom";

// ✅ CORRECT - No page reload, instant navigation
<Link to="/about">About</Link>;
```

---

## 🧭 Creating a Navigation Menu

```jsx
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <h1>My App</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
}

export default Header;
```

**CSS for Header:**

```css
.header {
  background: #7c3aed;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav {
  display: flex;
  gap: 1.5rem;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: 600;
}

nav a:hover {
  text-decoration: underline;
}
```

**🔬 Try in Practice Lab** ⬆️

---

## 🎨 Complete Multi-Page Example

```jsx
// App.jsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
```

```jsx
// pages/Contact.jsx
function Contact() {
  return (
    <div className="container">
      <h1>Contact Us</h1>
      <p>Email: contact@example.com</p>
      <p>Phone: (555) 123-4567</p>
    </div>
  );
}

export default Contact;
```

**🔬 Try in Practice Lab** ⬆️

---

## 🚀 Programmatic Navigation with useNavigate

Sometimes you need to navigate from JavaScript (e.g., after form submission).

```jsx
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Process login...
    console.log("Logged in!");

    // Navigate to home page
    navigate("/");
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
```

**🔬 Try in Practice Lab** ⬆️

---

## 🔢 URL Parameters

Create dynamic routes that accept parameters.

```jsx
// App.jsx
<Routes>
  <Route path="/user/:id" element={<UserProfile />} />
</Routes>
```

```jsx
// pages/UserProfile.jsx
import { useParams } from "react-router-dom";

function UserProfile() {
  const { id } = useParams();

  return (
    <div className="container">
      <h1>User Profile</h1>
      <p>User ID: {id}</p>
    </div>
  );
}

export default UserProfile;
```

**Test:** Navigate to `/user/1`, `/user/42`, `/user/alice`

**🔬 Try in Practice Lab** ⬆️

---

## 🎯 Active Link Styling with NavLink

`NavLink` automatically adds an `active` class to the current route.

```jsx
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <h1>My App</h1>
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
```

**CSS:**

```css
nav a.active {
  text-decoration: underline;
  font-weight: bold;
}
```

**🔬 Try in Practice Lab** ⬆️

---

## 🚫 404 Not Found Page

Handle routes that don't exist.

```jsx
// App.jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="*" element={<NotFound />} /> {/* Catch-all */}
</Routes>
```

```jsx
// pages/NotFound.jsx
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Go Home</Link>
    </div>
  );
}

export default NotFound;
```

**🔬 Try in Practice Lab** ⬆️

---

## 📐 Nested Routes with Layout

Use `Outlet` to create a common layout for multiple pages.

```jsx
// components/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
```

```jsx
// App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;
```

**Benefit:** Header and Footer appear on all pages automatically!

**🔬 Try in Practice Lab** ⬆️

---

## 🎨 Complete College App Example

```jsx
// App.jsx - Router Setup
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
```

```jsx
// components/Layout.jsx
import { Outlet, NavLink } from "react-router-dom";
import "./Layout.css";

function Layout() {
  return (
    <>
      <header className="header">
        <h1>College Directory</h1>
        <nav>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Register
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; 2025 College Directory. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Layout;
```

```jsx
// pages/Home.jsx
function Home() {
  return (
    <div className="container">
      <h1>Welcome to College Directory</h1>
      <p>Find and connect with students and alumni.</p>
    </div>
  );
}

export default Home;
```

**🔬 Try in Practice Lab** ⬆️

---

## ⚡ Best Practices

### 1. Always Use `<Link>` for Navigation

```jsx
// ❌ DON'T
<a href="/about">About</a>

// ✅ DO
<Link to="/about">About</Link>
```

### 2. Use `useNavigate` for Redirects

```jsx
const navigate = useNavigate();

const handleSubmit = () => {
  // Process form...
  navigate("/success");
};
```

### 3. Organize Pages in `/pages` Folder

```
src/
├── components/
│   ├── Header.jsx
│   └── Layout.jsx
└── pages/
    ├── Home.jsx
    ├── Login.jsx
    └── Register.jsx
```

### 4. Use Layout Components

Share common UI (header, footer) across multiple pages with `<Outlet>`.

---

## 🎯 Common Patterns

### Go Back Button

```jsx
import { useNavigate } from "react-router-dom";

function SomePage() {
  const navigate = useNavigate();

  return <button onClick={() => navigate(-1)}>Go Back</button>;
}
```

### Redirect After Action

```jsx
const navigate = useNavigate();

const handleDelete = () => {
  // Delete item...
  navigate("/", { replace: true }); // Can't go back to deleted item
};
```

### Query Parameters

```jsx
import { useSearchParams } from "react-router-dom";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q"); // /search?q=react

  return <p>Searching for: {query}</p>;
}
```

---

## ✅ Practice Exercise

Build a **Student Portal** with routing:

1. **Home Page** (`/`) - Welcome message
2. **Students Page** (`/students`) - List of students
3. **Student Detail** (`/students/:id`) - Individual student profile
4. **Login Page** (`/login`) - Login form
5. **404 Page** - For invalid routes

Requirements:

- Use `Layout` component for common header/footer
- Navigation menu with active link styling
- Navigate to home after successful login
- Show student ID in detail page using `useParams`

---

## 🎯 Key Takeaways

✅ **React Router enables multi-page navigation in SPAs**  
✅ **Use `<BrowserRouter>` to wrap your app**  
✅ **Define routes with `<Routes>` and `<Route>`**  
✅ **Use `<Link>` for navigation (not `<a>`)**  
✅ **`useNavigate` for programmatic navigation**  
✅ **`useParams` to access URL parameters**  
✅ **`<Outlet>` for nested routes and layouts**  
✅ **`NavLink` for active link styling**

---

## 🚀 Next Lesson

In **Lesson 2.5**, you'll combine routing with forms to build:

- Login page with navigation after success
- Registration page with multi-step process
- Form validation
- Redirecting based on form state

**Preview:**

```jsx
const navigate = useNavigate();

const handleLogin = (e) => {
  e.preventDefault();
  // Validate...
  navigate("/dashboard"); // Redirect after login
};
```

---

**Need Help?** Copy any code snippet above into your **Practice Lab** and experiment! 🧪

**Tip:** Set up routing FIRST, then build your forms in Lesson 2.5!
