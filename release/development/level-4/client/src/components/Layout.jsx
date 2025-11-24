import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatLabel = (value) => {
    if (!value) {
      return "";
    }

    const readable = value.replace(/_/g, " ").toLowerCase();
    return readable.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const initials = `${user?.first_name?.[0] ?? "A"}${
    user?.last_name?.[0] ?? "C"
  }`.toUpperCase();
  const roleLabel = formatLabel(
    user?.display_role || user?.effective_role || user?.user_role
  );
  const statusLabel = formatLabel(user?.user_status);

  return (
    <div className="layout">
      <div className="layout-ornaments" aria-hidden="true">
        <span className="layout-blob layout-blob--primary"></span>
        <span className="layout-blob layout-blob--secondary"></span>
        <span className="layout-grid"></span>
      </div>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="brand-mark">AC</div>
            <div>
              <h2>Alumni College</h2>
              <p className="brand-subtitle">Community Portal</p>
            </div>
          </div>
          <div className="navbar-links">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span className="nav-icon">🏠</span>
              Home
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span className="nav-icon">👥</span>
              Users
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span className="nav-icon">👤</span>
              Profile
            </NavLink>
          </div>
          <div className="navbar-user">
            <div className="user-info">
              <div className="user-avatar">{initials}</div>
              <div className="user-details">
                <span className="user-name">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="user-role">{roleLabel || "Member"}</span>
                {statusLabel && (
                  <span className="user-status">{statusLabel}</span>
                )}
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <div className="main-surface">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
