# 📘 Lesson 3.4 - fetch() vs axios

**Duration:** 45 minutes  
**Difficulty:** Intermediate

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

- ✅ Understand what `fetch()` is and how to use it
- ✅ Learn about `axios` library and its benefits
- ✅ Compare `fetch()` vs `axios` with real examples
- ✅ Make GET, POST, PUT, DELETE requests
- ✅ Handle errors properly
- ✅ Know when to use each approach

---

## 🌐 What is fetch()?

**`fetch()`** is a **built-in JavaScript function** for making HTTP requests.

**Think of it like:**

- You're ordering food online
- `fetch()` is the delivery app
- It takes your order (request) to the restaurant (API)
- Brings back your food (response)

**Key Points:**

- ✅ Built into all modern browsers (no installation needed)
- ✅ Returns a Promise
- ❌ Requires manual JSON parsing
- ❌ Doesn't auto-throw on HTTP errors

---

## 📝 Using fetch() - The Basics

### Example 1: Simple GET Request

```javascript
// 🔬 COPY THIS - Basic fetch example
fetch("http://localhost:5000/api/users")
  .then((response) => response.json()) // Convert to JSON
  .then((data) => console.log(data)) // Use the data
  .catch((error) => console.error(error)); // Handle errors
```

**What's happening?**

1. `fetch()` sends GET request (returns a Promise)
2. `.then()` waits for response
3. `.json()` converts response to JavaScript object (also returns a Promise!)
4. Second `.then()` gets the actual data
5. `.catch()` handles any errors

---

### Example 2: Modern Way with async/await

```javascript
// 🔬 COPY THIS - Modern fetch with async/await
async function getUsers() {
  try {
    const response = await fetch("http://localhost:5000/api/users");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

getUsers();
```

**Much cleaner!** ✨

---

### Example 3: POST Request with fetch()

```javascript
// 🔬 COPY THIS - POST request with fetch
async function createUser(userData) {
  try {
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Must manually set
      },
      body: JSON.stringify(userData), // Must manually stringify
    });

    const data = await response.json();
    console.log("User created:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Usage
createUser({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
});
```

**Notice:** You must:

- Set headers manually
- Stringify the body with `JSON.stringify()`

---

### Example 4: Proper Error Handling with fetch()

```javascript
// 🔬 COPY THIS - fetch with proper error handling
async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:5000/api/users");

    // fetch() doesn't throw on HTTP errors!
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
```

**Important:** fetch() only throws on **network errors**, not HTTP errors (404, 500)! You must check `response.ok` manually!

---

### Example 5: fetch() in React Component

```jsx
// 🔬 COPY THIS - Using fetch in React
import { useState, useEffect } from "react";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.data); // Assuming API returns { data: [...] }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.firstName} {user.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;
```

---

## 🔄 What is axios?

**axios** is a **popular JavaScript library** for making HTTP requests.

**Why use axios instead of fetch()?**

| Feature                  | fetch()                         | axios                          |
| ------------------------ | ------------------------------- | ------------------------------ |
| **Built-in**             | ✅ Yes                          | ❌ No (need to install)        |
| **JSON conversion**      | ❌ Manual (`response.json()`)   | ✅ Automatic                   |
| **Error handling**       | ❌ Manual check (`response.ok`) | ✅ Automatic (throws on error) |
| **Request cancellation** | ❌ Complex                      | ✅ Easy                        |
| **Interceptors**         | ❌ No                           | ✅ Yes (global config)         |
| **Old browser support**  | ❌ Limited                      | ✅ Better                      |
| **Timeout**              | ❌ Not built-in                 | ✅ Easy to set                 |

---

### Installing axios

```bash
npm install axios
```

---

## 📦 Using axios

### Example 6: GET Request with axios

```javascript
// 🔬 COPY THIS - GET with axios
import axios from "axios";

async function getUsers() {
  try {
    const response = await axios.get("http://localhost:5000/api/users");
    console.log(response.data); // Data is already parsed! 🎉
  } catch (error) {
    console.error("Error:", error.message);
  }
}

getUsers();
```

**Notice:**

- No `.json()` needed!
- Automatic JSON parsing!
- Throws on HTTP errors automatically!

---

### Example 7: POST Request with axios

```javascript
// 🔬 COPY THIS - POST with axios
import axios from "axios";

async function createUser(userData) {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/users",
      userData // No stringify needed! 🎉
    );
    console.log("User created:", response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

// Usage - no need to stringify!
createUser({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
});
```

**Notice:**

- No `JSON.stringify()` needed!
- No manual headers needed!
- Much cleaner!

---

### Example 8: axios in React Component

```jsx
// 🔬 COPY THIS - Using axios in React
import { useState, useEffect } from "react";
import axios from "axios";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data.data); // Axios auto-parses JSON
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.firstName} {user.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;
```

---

## 📊 Side-by-Side Comparison

### GET Request

```javascript
// ========================================
// fetch() - Manual JSON parsing
// ========================================
const getUsers = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/users");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Must manually parse
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

// ========================================
// axios - Automatic JSON parsing
// ========================================
const getUsers = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/users");
    return response.data; // Already parsed! ✨
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};
```

---

### POST Request

```javascript
// ========================================
// fetch() - Manual headers and stringify
// ========================================
const createUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Manual
      },
      body: JSON.stringify(userData), // Manual
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

// ========================================
// axios - Cleaner and automatic
// ========================================
const createUser = async (userData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/users",
      userData // No stringify! No headers! ✨
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};
```

---

### PUT Request

```javascript
// ========================================
// fetch() - PUT
// ========================================
const updateUser = async (id, userData) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

// ========================================
// axios - PUT
// ========================================
const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/users/${id}`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};
```

---

### DELETE Request

```javascript
// ========================================
// fetch() - DELETE
// ========================================
const deleteUser = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

// ========================================
// axios - DELETE
// ========================================
const deleteUser = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/users/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};
```

---

## 🎯 Advanced axios Features

### Feature 1: Create axios Instance (Recommended!)

```javascript
// 🔬 COPY THIS - Create reusable axios instance
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // 5 second timeout
});

// Now use it everywhere!
const getUsers = () => api.get("/users");
const getUser = (id) => api.get(`/users/${id}`);
const createUser = (data) => api.post("/users", data);
const updateUser = (id, data) => api.put(`/users/${id}`, data);
const deleteUser = (id) => api.delete(`/users/${id}`);
```

**Benefits:**

- No need to repeat base URL
- Consistent configuration
- Easy to change later

---

### Feature 2: Request/Response Interceptors

```javascript
// 🔬 COPY THIS - Add interceptors
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add request interceptor (runs before every request)
api.interceptors.request.use(
  (config) => {
    // Add auth token to every request
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Making request to:", config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor (runs on every response)
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      console.log("Unauthorized! Redirecting to login...");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

**This is VERY useful for authentication!** 🔐

---

### Feature 3: Cancel Requests

```javascript
// 🔬 COPY THIS - Cancel requests
import axios from "axios";

let cancelToken;

async function searchUsers(query) {
  // Cancel previous request if it exists
  if (cancelToken) {
    cancelToken.cancel("New request started");
  }

  // Create new cancel token
  cancelToken = axios.CancelToken.source();

  try {
    const response = await axios.get(`/api/users?search=${query}`, {
      cancelToken: cancelToken.token,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      console.error("Error:", error);
    }
  }
}

// If user types fast, old requests get canceled!
```

**Perfect for search boxes!** 🔍

---

## 🎯 When to Use fetch() vs axios?

### Use `fetch()` when:

- ✅ No extra dependencies needed (keeping bundle small)
- ✅ Simple GET/POST requests
- ✅ Modern browsers only
- ✅ Small projects or learning basics

### Use `axios` when:

- ✅ Complex applications
- ✅ Need request/response interceptors
- ✅ Better error handling required
- ✅ Need to cancel requests
- ✅ Working with older browsers
- ✅ Team projects (consistency)

**For this course, we'll use axios going forward!** 🚀

---

## 📚 Summary

| Concept             | Description                                 |
| ------------------- | ------------------------------------------- |
| **fetch()**         | Built-in browser API for HTTP requests      |
| **axios**           | Popular library for HTTP requests (cleaner) |
| **response.json()** | fetch() method to parse JSON                |
| **response.data**   | axios property with parsed data             |
| **response.ok**     | fetch() property to check success (200-299) |
| **axios.create()**  | Create configured axios instance            |
| **interceptors**    | Middleware for requests/responses           |
| **CancelToken**     | axios feature to cancel in-flight requests  |

---

## ✅ Checklist

Before moving to Lesson 3.5, make sure you can:

- [ ] Make GET requests with fetch()
- [ ] Make POST requests with fetch()
- [ ] Handle errors properly with fetch()
- [ ] Make GET requests with axios
- [ ] Make POST requests with axios
- [ ] Understand the differences between fetch() and axios
- [ ] Create an axios instance with baseURL
- [ ] Know when to use fetch vs axios
- [ ] Use axios interceptors
- [ ] Cancel requests with axios

---

## 🎯 What's Next?

In **Lesson 3.5**, you'll build a complete CRUD interface, organize your API calls into a service layer, and connect everything to React! You'll use axios to make it clean and professional! 🚀

---

**You've mastered HTTP requests in JavaScript!** 🎉 Continue to [Lesson 3.5](lesson-3.5-crud-frontend.md)!
