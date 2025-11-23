# 📘 Lesson 3.3 - CRUD Operations & Frontend Integration

**Duration:** 45 minutes  
**Difficulty:** Intermediate

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

- ✅ Understand CRUD operations in depth
- ✅ Organize Express routes into separate files
- ✅ Add validation and error handling
- ✅ Connect React frontend to Express backend
- ✅ Make API calls with **both `fetch()` and `axios`**
- ✅ Compare fetch() vs axios in real applications
- ✅ Handle loading states and errors in React
- ✅ Test complete full-stack flow

---

## 🤔 What is CRUD?

**CRUD** = Create, Read, Update, Delete

These are the **4 basic operations** for any database or data storage:

| Operation  | HTTP Method | Example API Call      | What it does         |
| ---------- | ----------- | --------------------- | -------------------- |
| **Create** | POST        | POST /api/users       | Add new user         |
| **Read**   | GET         | GET /api/users        | Get all users        |
| **Read**   | GET         | GET /api/users/:id    | Get one user         |
| **Update** | PUT/PATCH   | PUT /api/users/:id    | Modify existing user |
| **Delete** | DELETE      | DELETE /api/users/:id | Remove user          |

**Every app needs CRUD!** Social media, e-commerce, banking - all use these operations.

---

## 🛠️ Organizing Routes (Better Structure)

Instead of putting everything in `server.js`, let's organize routes into separate files.

### Step 1: Create routes Folder

```bash
cd college-app-server/express-api
mkdir routes
```

---

### Step 2: Create users.routes.js

```javascript
// 🔬 COPY THIS - routes/users.routes.js
import express from "express";

const router = express.Router();

// In-memory database (move from server.js)
let users = [
  {
    id: 1,
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@college.edu",
    mobile: "+1234567890",
    gender: "Female",
    age: 20,
    role: "Student",
    program: "Computer Science",
  },
  {
    id: 2,
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@college.edu",
    mobile: "+1234567891",
    gender: "Male",
    age: 22,
    role: "Student",
    program: "Engineering",
  },
  {
    id: 3,
    firstName: "Dr. Carol",
    lastName: "Williams",
    email: "carol@college.edu",
    mobile: "+1234567892",
    gender: "Female",
    age: 45,
    role: "Faculty",
    program: "Mathematics",
  },
];

let nextId = 4;

// ========================================
// GET ALL USERS
// ========================================
router.get("/", (req, res) => {
  try {
    // Optional: Filter by role
    const { role } = req.query;

    let filteredUsers = users;
    if (role) {
      filteredUsers = users.filter(
        (u) => u.role.toLowerCase() === role.toLowerCase()
      );
    }

    res.json({
      success: true,
      count: filteredUsers.length,
      data: filteredUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// ========================================
// GET USER BY ID
// ========================================
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found`,
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// ========================================
// CREATE NEW USER
// ========================================
router.post("/", (req, res) => {
  try {
    const { firstName, lastName, email, mobile, gender, age, role, program } =
      req.body;

    // Validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: "firstName, lastName, and email are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if email already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Create new user
    const newUser = {
      id: nextId++,
      firstName,
      lastName,
      email,
      mobile: mobile || "",
      gender: gender || "",
      age: age || null,
      role: role || "Student",
      program: program || "Undeclared",
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// ========================================
// UPDATE USER
// ========================================
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found`,
      });
    }

    // Check email uniqueness if email is being updated
    if (req.body.email && req.body.email !== users[userIndex].email) {
      const existingUser = users.find((u) => u.email === req.body.email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Update user (merge with existing data)
    users[userIndex] = {
      ...users[userIndex],
      ...req.body,
      id: id, // Keep original ID
    };

    res.json({
      success: true,
      message: "User updated successfully",
      data: users[userIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// ========================================
// DELETE USER
// ========================================
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found`,
      });
    }

    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);

    res.json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;
```

---

### Step 3: Update server.js

```javascript
// 🔬 COPY THIS - server.js (simplified)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routes/users.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware (optional but helpful)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ========================================
// ROUTES
// ========================================

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to College Kit API!",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
    },
  });
});

// Users routes
app.use("/api/users", usersRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/`);
});
```

**Much cleaner!** Routes are now organized.

---

## 🌐 Connecting React Frontend to Backend

Now let's compare **fetch()** vs **axios** in a real application!

---

## 📦 Version 1: API Service with fetch()

### Step 1: Create API Service (fetch version)

```javascript
// 🔬 COPY THIS - src/services/api.js (fetch version)
const API_URL = "http://localhost:5000/api";

// ========================================
// GET ALL USERS
// ========================================
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`);

    // fetch() doesn't auto-throw on error status
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Must manually parse JSON

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// ========================================
// GET USER BY ID
// ========================================
export const getUserById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

// ========================================
// CREATE USER
// ========================================
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Must manually set headers
      },
      body: JSON.stringify(userData), // Must manually stringify
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// ========================================
// UPDATE USER
// ========================================
export const updateUser = async (id, userData) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

// ========================================
// DELETE USER
// ========================================
export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};
```

**Notice:** fetch() requires manual error checking and JSON parsing! 🔍

---

## 📦 Version 2: API Service with axios

### Step 1: Install axios

```bash
npm install axios
```

---

### Step 2: Create API Service (axios version)

```javascript
// 🔬 COPY THIS - src/services/api.js (axios version)
import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create axios instance with base config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ========================================
// GET ALL USERS
// ========================================
export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    // axios auto-parses JSON and throws on error status!
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching users:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ========================================
// GET USER BY ID
// ========================================
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(
      `Error fetching user ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// ========================================
// CREATE USER
// ========================================
export const createUser = async (userData) => {
  try {
    const response = await api.post("/users", userData); // No stringify needed!
    return response.data.data;
  } catch (error) {
    console.error(
      "Error creating user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ========================================
// UPDATE USER
// ========================================
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.data;
  } catch (error) {
    console.error(
      `Error updating user ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// ========================================
// DELETE USER
// ========================================
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(
      `Error deleting user ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export default api;
```

**Much cleaner!** axios handles JSON automatically! ✨

---

## 📊 Side-by-Side Comparison

### Creating a User

```javascript
// ========================================
// fetch() - More verbose
// ========================================
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ❌ Manual headers
      },
      body: JSON.stringify(userData), // ❌ Manual stringify
    });

    if (!response.ok) {
      // ❌ Manual error check
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // ❌ Manual JSON parsing
    return data.data;
  } catch (error) {
    throw error;
  }
};

// ========================================
// axios - Clean and simple
// ========================================
export const createUser = async (userData) => {
  try {
    const response = await api.post("/users", userData); // ✅ Automatic!
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
```

---

### Deleting a User

```javascript
// ========================================
// fetch() - DELETE
// ========================================
export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};

// ========================================
// axios - DELETE (shorter!)
// ========================================
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
```

---

## 🎯 Which Should You Use?

### Use **fetch()** when:

- ✅ No extra dependencies needed
- ✅ Simple GET requests
- ✅ Learning basics
- ✅ Small projects

### Use **axios** when:

- ✅ Multiple API calls
- ✅ Need request/response interceptors
- ✅ Better error handling
- ✅ Real-world applications
- ✅ Working with teams

**For this course, we'll use axios** going forward! 🚀

---

### Step 3: Create Users Page

The Users page works the same with both fetch() and axios!

```jsx
// 🔬 COPY THIS - src/pages/Users.jsx
import { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "../services/api";
import "../styles/Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await deleteUser(id);
      // Refresh users list
      fetchUsers();
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="users-page">
        <div className="container">
          <p className="loading">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-page">
        <div className="container">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={fetchUsers}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="container">
        <h1>All Users</h1>
        <p className="users-count">Total: {users.length} users</p>

        <div className="users-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <h3>
                {user.firstName} {user.lastName}
              </h3>
              <p className="role">{user.role}</p>
              <div className="user-info">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Program:</strong> {user.program}
                </p>
                {user.mobile && (
                  <p>
                    <strong>Mobile:</strong> {user.mobile}
                  </p>
                )}
                {user.age && (
                  <p>
                    <strong>Age:</strong> {user.age}
                  </p>
                )}
                {user.gender && (
                  <p>
                    <strong>Gender:</strong> {user.gender}
                  </p>
                )}
              </div>
              <div className="user-actions">
                <button className="btn-edit">Edit</button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Users;
```

---

### Step 3: Create Users.css

```css
/* 🔬 COPY THIS - src/styles/Users.css */
.users-page {
  min-height: calc(100vh - 200px);
  padding: 3rem 0;
  background-color: #f5f7fa;
}

.users-page h1 {
  text-align: center;
  color: #2d3748;
  margin-bottom: 1rem;
}

.users-count {
  text-align: center;
  color: #718096;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #667eea;
  padding: 3rem;
}

.error-message {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

.error-message h2 {
  color: #f56565;
  margin-bottom: 1rem;
}

.error-message button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.user-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.user-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-card h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.user-card .role {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 1rem;
}

.user-info {
  margin-bottom: 1rem;
}

.user-info p {
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-edit {
  background: #667eea;
  color: white;
}

.btn-edit:hover {
  background: #5568d3;
}

.btn-delete {
  background: #f56565;
  color: white;
}

.btn-delete:hover {
  background: #e53e3e;
}
```

---

### Step 4: Add Route

```jsx
// Add to App.jsx
import Users from "./pages/Users";

// Inside Routes
<Route path="/users" element={<Users />} />;
```

---

## 🧪 Testing the Full Stack

### Test Flow:

1. **Start Backend:**

```bash
cd college-app-server/express-api
npm run dev
```

2. **Start Frontend:**

```bash
cd college-app-client-level-3
npm run dev
```

3. **Navigate:** `http://localhost:5173/users`

4. **You should see:** List of users from backend

5. **Try Delete:** Click delete button, user removed

6. **Check Postman:** POST new user, it appears in frontend

---

## 🔑 Key Concepts

### Async/Await Pattern

```javascript
// ❌ Old way (callback hell)
fetch(url)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

// ✅ Modern way (async/await)
const fetchData = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
```

---

### Three Loading States

```javascript
const [data, setData] = useState(null); // Data
const [loading, setLoading] = useState(true); // Loading
const [error, setError] = useState(null); // Error

// Always handle all three states in UI!
```

---

## 📚 Summary

| Concept            | Description                                 |
| ------------------ | ------------------------------------------- |
| **CRUD**           | Create, Read, Update, Delete operations     |
| **Router**         | Organize routes in separate files           |
| **fetch()**        | Built-in browser API for HTTP requests      |
| **axios**          | Popular library for HTTP requests (cleaner) |
| **async/await**    | Modern way to handle asynchronous code      |
| **try-catch**      | Error handling for async operations         |
| **Loading States** | loading, error, data - handle all three     |
| **API Service**    | Centralized file for all API calls          |

---

## ✅ Checklist

Before moving to Lesson 3.4, make sure you can:

- [ ] Create organized route files
- [ ] Add validation to API endpoints
- [ ] Make API calls from React with fetch()
- [ ] Make API calls from React with axios
- [ ] Compare fetch() vs axios
- [ ] Handle loading and error states
- [ ] Display data from backend in React
- [ ] Delete data and refresh UI
- [ ] Understand when to use fetch vs axios

---

## 🎯 What's Next?

In **Lesson 3.4**, we'll learn about Strapi CMS - a powerful headless CMS that gives us a real database and admin panel!

---

**You've mastered CRUD and learned both fetch() and axios!** 🎉 Continue to [Lesson 3.4](lesson-3.4-strapi-setup.md)!
