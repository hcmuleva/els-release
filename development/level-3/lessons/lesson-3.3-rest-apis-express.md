# 📘 Lesson 3.3 - REST APIs & Express.js

**Duration:** 60 minutes  
**Difficulty:** Intermediate

---

## � Quick Start Option

**Want to skip to using a working API?** We've already created a complete Express REST API for you!

```bash
cd college-app-server/express-api
npm install
cp .env.example .env
# Edit .env and set JWT_SECRET=your-secret-key
npm run dev
```

✅ Ready-to-use API with authentication  
✅ In-memory database (no setup)  
✅ All CRUD operations working  
✅ See `express-api/README.md` for full documentation

**This lesson teaches you how to build it from scratch** - great for understanding how it works!

---

## �🎯 Learning Objectives

By the end of this lesson, you will:

- ✅ Understand what an API is and why we need it
- ✅ Learn REST API concepts and HTTP methods
- ✅ Install and set up Node.js and Express.js
- ✅ Create your first Express server
- ✅ Build API routes (GET, POST, PUT, DELETE)
- ✅ Test APIs with Postman
- ✅ Understand environment variables (.env)

---

## 🤔 What is an API?

### API = Application Programming Interface

An **API** is like a **waiter in a restaurant**:

```
You (Frontend) → Waiter (API) → Kitchen (Backend/Database)
```

**Example:**

- You want to see all users
- You ask the API: "GET /api/users"
- API fetches data from database
- API returns data to you

**Why APIs?**

- ✅ Separate frontend and backend
- ✅ Multiple apps can use same API (web, mobile, desktop)
- ✅ Secure - database is hidden from users
- ✅ Organized - each endpoint has one job

---

## 🌐 What is REST?

**REST** = Representational State Transfer

A **standard way** to build APIs using HTTP methods.

### HTTP Methods (CRUD Operations)

| Method     | Operation | Example               | What it does          |
| ---------- | --------- | --------------------- | --------------------- |
| **GET**    | Read      | `GET /api/users`      | Get all users         |
| **GET**    | Read      | `GET /api/users/1`    | Get user with ID 1    |
| **POST**   | Create    | `POST /api/users`     | Create new user       |
| **PUT**    | Update    | `PUT /api/users/1`    | Update user with ID 1 |
| **DELETE** | Delete    | `DELETE /api/users/1` | Delete user with ID 1 |

**CRUD = Create, Read, Update, Delete** (all database operations)

---

## 🛠️ Setting Up Node.js & Express

### Step 1: Check Node.js Installation

Open terminal:

```bash
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher
```

**Don't have Node.js?** Download from [nodejs.org](https://nodejs.org)

---

### Step 2: Create Express Server Folder

```bash
# Navigate to level-3 folder
cd level-3

# Create server directory
mkdir -p college-app-server/express-api
cd college-app-server/express-api

# Initialize Node.js project
npm init -y
```

---

### Step 3: Install Dependencies

```bash
npm install express cors dotenv
npm install --save-dev nodemon
```

**What are these?**

| Package   | What it does                              |
| --------- | ----------------------------------------- |
| `express` | Web framework for building APIs           |
| `cors`    | Allow frontend to access API              |
| `dotenv`  | Load environment variables from .env file |
| `nodemon` | Auto-restart server when code changes     |

---

### Step 4: Update package.json

Add this to `scripts` section:

```json
{
  "name": "express-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**Important:** `"type": "module"` lets us use ES6 imports!

---

## 🚀 Building Your First Express Server

### Step 1: Create server.js

```javascript
// 🔬 COPY THIS - server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// PORT from .env or default 5000
const PORT = process.env.PORT || 5000;

// ========================================
// TEST ROUTE
// ========================================
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to College Kit API!",
    version: "1.0.0",
  });
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

**What's happening?**

- `express()` - Creates the app
- `app.use()` - Adds middleware
- `app.get()` - Defines a GET route
- `app.listen()` - Starts the server

---

### Step 2: Create .env File

```bash
# 🔬 COPY THIS - .env
PORT=5000
NODE_ENV=development
```

**What is .env?**

- Stores configuration (ports, API keys, passwords)
- NOT committed to Git (add to .gitignore)
- Different values for development/production

**.gitignore** (create this too):

```
node_modules/
.env
```

---

### Step 3: Start the Server

```bash
npm run dev
```

**Output:**

```
✅ Server running on http://localhost:5000
```

---

### Step 4: Test in Browser

Open browser: `http://localhost:5000`

**You should see:**

```json
{
  "message": "Welcome to College Kit API!",
  "version": "1.0.0"
}
```

🎉 **Your first API is running!**

---

## 📝 Creating API Routes

Now let's add real routes for users!

### Step 1: Add In-Memory Database

```javascript
// 🔬 ADD THIS - After app creation, before routes

// In-memory database (temporary - resets when server restarts)
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
    program: "Business",
  },
  {
    id: 3,
    firstName: "Charlie",
    lastName: "Brown",
    email: "charlie@college.edu",
    mobile: "+1234567892",
    gender: "Male",
    age: 19,
    role: "Student",
    program: "Engineering",
  },
];

let nextId = 4; // For creating new users
```

---

### Step 2: GET All Users

```javascript
// 🔬 ADD THIS - server.js

// ========================================
// GET ALL USERS
// ========================================
app.get("/api/users", (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});
```

**Test:** `http://localhost:5000/api/users`

**You should see:**

```json
{
  "success": true,
  "count": 3,
  "data": [
    /* array of users */
  ]
}
```

---

### Step 3: GET User by ID

```javascript
// 🔬 ADD THIS - server.js

// ========================================
// GET USER BY ID
// ========================================
app.get("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
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
});
```

**Test:** `http://localhost:5000/api/users/1`

**`:id` is a route parameter** - dynamic value from URL

---

### Step 4: POST - Create New User

```javascript
// 🔬 ADD THIS - server.js

// ========================================
// CREATE NEW USER
// ========================================
app.post("/api/users", (req, res) => {
  const { firstName, lastName, email, mobile, gender, age, role, program } =
    req.body;

  // Validation
  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      success: false,
      message: "Please provide firstName, lastName, and email",
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

  const newUser = {
    id: nextId++,
    firstName,
    lastName,
    email,
    mobile: mobile || "",
    gender: gender || "Not specified",
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
});
```

**Can't test in browser - need Postman!**

---

### Step 5: PUT - Update User

```javascript
// 🔬 ADD THIS - server.js

// ========================================
// UPDATE USER
// ========================================
app.put("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
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
});
```

---

### Step 6: DELETE User

```javascript
// 🔬 ADD THIS - server.js

// ========================================
// DELETE USER
// ========================================
app.delete("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
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
});
```

---

## 🧪 Testing with Postman

**Postman** is a tool for testing APIs. Download from [postman.com](https://www.postman.com/downloads/)

### Test 1: GET All Users

1. Open Postman
2. Create new request
3. Method: **GET**
4. URL: `http://localhost:5000/api/users`
5. Click **Send**

**Expected Response:**

```json
{
  "success": true,
  "count": 3,
  "data": [
    /* array of users */
  ]
}
```

---

### Test 2: POST - Create User

1. Method: **POST**
2. URL: `http://localhost:5000/api/users`
3. Click **Body** tab
4. Select **raw** and **JSON**
5. Enter:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@college.edu",
  "mobile": "+1234567899",
  "gender": "Male",
  "age": 21,
  "role": "Student",
  "program": "Mathematics"
}
```

6. Click **Send**

**Expected Response:**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 4,
    "firstName": "John",
    ...
  }
}
```

---

### Test 3: PUT - Update User

1. Method: **PUT**
2. URL: `http://localhost:5000/api/users/1`
3. Body (JSON):

```json
{
  "age": 21,
  "program": "Data Science"
}
```

4. Click **Send**

---

### Test 4: DELETE User

1. Method: **DELETE**
2. URL: `http://localhost:5000/api/users/4`
3. Click **Send**

**User should be deleted!**

---

## 🔑 Key Concepts

### HTTP Status Codes

| Code | Meaning               | When to use                   |
| ---- | --------------------- | ----------------------------- |
| 200  | OK                    | Successful GET, PUT, DELETE   |
| 201  | Created               | Successful POST (created new) |
| 400  | Bad Request           | Invalid data sent             |
| 404  | Not Found             | Resource doesn't exist        |
| 500  | Internal Server Error | Server crashed                |

---

### Middleware

Functions that run **before** your route handlers:

```javascript
app.use(express.json()); // Parses JSON
app.use(cors()); // Enables CORS

// Custom middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next(); // Continue to next middleware/route
});
```

---

### Route Parameters vs Query Strings

```javascript
// Route Parameter (in URL path)
app.get("/api/users/:id", ...)
// URL: /api/users/1
const id = req.params.id;

// Query String (after ?)
app.get("/api/users", ...)
// URL: /api/users?role=Student&age=20
const role = req.query.role;
const age = req.query.age;
```

---

## 📁 Complete server.js

```javascript
// 🔬 COPY THIS - Complete server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
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
    program: "Business",
  },
  {
    id: 3,
    firstName: "Charlie",
    lastName: "Brown",
    email: "charlie@college.edu",
    mobile: "+1234567892",
    gender: "Male",
    age: 19,
    role: "Student",
    program: "Engineering",
  },
];

let nextId = 4;

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

// Get all users
app.get("/api/users", (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

// Get user by ID
app.get("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
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
});

// Create new user
app.post("/api/users", (req, res) => {
  const { firstName, lastName, email, mobile, gender, age, role, program } =
    req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      success: false,
      message: "Please provide firstName, lastName, and email",
    });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  const newUser = {
    id: nextId++,
    firstName,
    lastName,
    email,
    mobile: mobile || "",
    gender: gender || "Not specified",
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
});

// Update user
app.put("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `User with ID ${id} not found`,
    });
  }

  if (req.body.email && req.body.email !== users[userIndex].email) {
    const existingUser = users.find((u) => u.email === req.body.email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
  }

  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
    id: id,
  };

  res.json({
    success: true,
    message: "User updated successfully",
    data: users[userIndex],
  });
});

// Delete user
app.delete("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
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
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

---

## 🧪 Practice Tasks

### Task 1: Add Query Parameter Filtering

Add ability to filter users by role:

```
GET /api/users?role=Student
```

### Task 2: Add Pagination

Add limit and offset query params:

```
GET /api/users?limit=10&offset=0
```

### Task 3: Add More Validation

Validate email format, age range, etc.

---

## 📚 Summary

| Concept        | Description                                        |
| -------------- | -------------------------------------------------- |
| **API**        | Interface for frontend to communicate with backend |
| **REST**       | Standard for building APIs with HTTP methods       |
| **Express**    | Node.js framework for building APIs                |
| **Middleware** | Functions that run before route handlers           |
| **.env**       | Environment variables file                         |
| **Postman**    | Tool for testing APIs                              |
| **CRUD**       | Create, Read, Update, Delete operations            |

---

## ✅ Checklist

Before moving to Lesson 3.4, make sure you can:

- [ ] Explain what an API is and why we need it
- [ ] List all CRUD operations
- [ ] Create an Express server
- [ ] Build GET, POST, PUT, DELETE routes
- [ ] Test APIs with Postman
- [ ] Use environment variables with .env
- [ ] Understand HTTP status codes
- [ ] Use route parameters (`:id`)
- [ ] Use query strings (`?role=Student`)

---

## 🎯 What's Next?

In **Lesson 3.4**, you'll learn about `fetch()` and `axios` - how to call your API from React! You already understand Promises and async/await, so this will be easy! 🚀

---

**You've built your first REST API!** 🎉 Continue to [Lesson 3.4](lesson-3.4-fetch-axios.md)!
