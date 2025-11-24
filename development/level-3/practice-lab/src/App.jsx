import { useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([
    { id: 1, name: "Alice Johnson", role: "STUDENT" },
    { id: 2, name: "Bob Smith", role: "ALUMNI" },
  ]);

  return (
    <div className="container">
      <h1>🧪 Level 3 Practice Lab</h1>
      <p className="subtitle">
        React Hooks + Strapi API Integration - Practice building real
        applications!
      </p>

      <div className="example-box">
        <h2>Example: User List</h2>
        <div className="user-list">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <strong>{user.name}</strong> - {user.role}
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            setUsers([
              ...users,
              {
                id: users.length + 1,
                name: "New User",
                role: "STUDENT",
              },
            ])
          }
        >
          Add User
        </button>
      </div>

      <div className="instructions">
        <h3>📖 How to Use This Lab</h3>
        <ol>
          <li>
            Open a lesson from <code>lessons/</code> folder
          </li>
          <li>
            Find code marked with <strong>🔬 Try in Practice Lab</strong>
          </li>
          <li>Copy the code and paste it here</li>
          <li>Save and watch it update automatically!</li>
        </ol>

        <h3>📚 Lessons Available</h3>
        <ul>
          <li>Lesson 3.1 - Introduction to APIs & Strapi</li>
          <li>Lesson 3.2 - Setting up Authentication</li>
          <li>Lesson 3.3 - Fetching Data with useEffect</li>
          <li>Lesson 3.4 - Creating and Updating Users</li>
          <li>Lesson 3.5 - Building Complete CRUD</li>
        </ul>

        <h3>🎯 What You'll Practice</h3>
        <ul>
          <li>✅ API Integration with Strapi backend</li>
          <li>✅ JWT Authentication (Login/Register)</li>
          <li>✅ useState and useEffect hooks</li>
          <li>✅ CRUD operations (Create, Read, Update, Delete)</li>
          <li>✅ Context API for global state</li>
          <li>✅ Protected routes and role-based access</li>
        </ul>

        <p className="tip">
          <strong>💡 Tip:</strong> Make sure Strapi backend is running on
          <code>http://202.38.182.170:1348/api</code> before testing API calls!
        </p>

        <div className="tech-stack">
          <h3>🛠️ Tech Stack</h3>
          <ul>
            <li>React 19 with Hooks</li>
            <li>Strapi 4 CMS Backend</li>
            <li>Axios for HTTP requests</li>
            <li>React Router for navigation</li>
            <li>Context API for state</li>
            <li>Custom CSS styling</li>
          </ul>
        </div>

        <div className="backend-info">
          <h3>🔗 Backend Connection</h3>
          <p>
            This level connects to a real Strapi backend. You'll learn how to:
          </p>
          <ul>
            <li>Make authenticated API requests</li>
            <li>Store JWT tokens in localStorage</li>
            <li>Handle loading and error states</li>
            <li>Transform backend data for frontend use</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
