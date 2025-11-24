// ========================================
// LEVEL 2: Main App Component
// Learning: React Router for multi-page navigation
// Learning: Routes, Route, BrowserRouter
// ========================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./styles/App.css";

/**
 * App sets up routing for the entire application
 *
 * New in Level 2:
 * - BrowserRouter: Enables routing
 * - Routes: Container for all Route components
 * - Route: Defines path and component to render
 * - Layout: Wrapper with Header/Footer, uses Outlet for pages
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wraps all pages with Header and Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

/*
🎓 LEARNING NOTES:

1. REACT ROUTER:
   - BrowserRouter: Wraps entire app to enable routing
   - Routes: Container for all route definitions
   - Route: Maps URL path to component

2. NESTED ROUTES:
   - Layout route has no path - it wraps child routes
   - Child routes (/, /login, /register) render inside Layout's <Outlet />
   - Header and Footer stay consistent across all pages

3. NAVIGATION:
   - Use <Link to="/path"> instead of <a href="/path">
   - Use <NavLink> for active link styling
   - Use useNavigate() hook for programmatic navigation

4. URL STRUCTURE:
   - "/" - Home page with member directory
   - "/login" - Login form
   - "/register" - Registration form

WHAT'S NEW FROM OLD LEVEL 2:
- Old: Single page with all components
- New: Multi-page app with routing and navigation
- Search and filters now work with useState!
*/
