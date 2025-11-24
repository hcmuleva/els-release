// ========================================
// Layout Component - Page Template
// Learning: Outlet for nested routes, NavLink for navigation
// ========================================

import { Outlet, NavLink } from "react-router-dom";
import Footer from "./Footer";
import "../styles/Layout.css";

function Layout() {
  return (
    <div className="layout">
      {/* Header with Navigation */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <h1 className="logo">🎓 College Kit</h1>
              <p className="tagline">Your Campus Community Hub</p>
            </div>

            {/* Navigation Links */}
            <nav className="nav">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Register
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content - Child routes render here */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout;
