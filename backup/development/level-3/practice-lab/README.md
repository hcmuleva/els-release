# Level 3 Practice Lab

## 🎯 Overview

This practice lab reinforces the concepts learned in **Level 3** by building real API-connected features. You'll practice React Hooks with a real Strapi backend.

---

## 📚 Prerequisites

Before starting, complete:

- ✅ Level 1 (Vanilla JS fundamentals)
- ✅ Level 2 (React components & hooks)
- ✅ Level 3 Lessons 3.1-3.5

---

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd practice-lab
npm install
```

### 2. Verify Backend is Running

Make sure Strapi backend is accessible at:

```
http://202.38.182.170:1348/api
```

### 3. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:5173

---

## 🎓 Lab Exercises

### Exercise 1: Fetch Users from API

**Goal**: Use `useEffect` to fetch and display users from Strapi

**Tasks**:

1. ✅ Import `useEffect` from React
2. ✅ Create `fetchUsers` function using Axios
3. ✅ Call API on component mount
4. ✅ Display users in a list
5. ✅ Handle loading and error states

**API Endpoint**: `GET /users`

---

### Exercise 2: Authentication Flow

**Goal**: Implement login and store JWT token

**Tasks**:

1. ✅ Create login form with username/password
2. ✅ Call `/auth/local` endpoint
3. ✅ Store JWT token in localStorage
4. ✅ Display user info after login
5. ✅ Implement logout function

**API Endpoint**: `POST /auth/local`

---

### Exercise 3: Context API for Auth

**Goal**: Share authentication state across components

**Tasks**:

1. ✅ Create `AuthContext.jsx`
2. ✅ Provide `user`, `login`, `logout` functions
3. ✅ Use `useContext` hook in components
4. ✅ Persist auth state on refresh
5. ✅ Redirect based on auth status

---

### Exercise 4: Create New User

**Goal**: Implement user registration

**Tasks**:

1. ✅ Create registration form
2. ✅ Call `/auth/local/register` endpoint
3. ✅ Handle validation errors
4. ✅ Auto-login after successful registration
5. ✅ Display success message

**API Endpoint**: `POST /auth/local/register`

---

### Exercise 5: Update User Profile

**Goal**: Edit and save user information

**Tasks**:

1. ✅ Create profile form with all fields
2. ✅ Pre-fill form with current user data
3. ✅ Call `PUT /users/:id` endpoint
4. ✅ Update Context with new user data
5. ✅ Handle API errors gracefully

**API Endpoint**: `PUT /users/:id`

---

### Exercise 6: Delete User (Admin Only)

**Goal**: Implement user deletion with role check

**Tasks**:

1. ✅ Check if user is ADMIN
2. ✅ Add delete button to user cards
3. ✅ Confirm before deletion
4. ✅ Call `DELETE /users/:id` endpoint
5. ✅ Remove user from local state

**API Endpoint**: `DELETE /users/:id`

---

## 🧪 Testing Checklist

### Authentication

- [ ] Login with valid credentials
- [ ] Login shows error with invalid credentials
- [ ] JWT token stored in localStorage
- [ ] User data available in Context
- [ ] Logout clears token and redirects

### API Integration

- [ ] Fetch users on page load
- [ ] Loading spinner shows while fetching
- [ ] Error message displays on API failure
- [ ] Data displays correctly after fetch
- [ ] Network tab shows correct API calls

### CRUD Operations

- [ ] Create new user via registration
- [ ] Read user list from API
- [ ] Update user profile
- [ ] Delete user (admin only)
- [ ] All operations update UI immediately

---

## 📂 Expected Code Structure

```
practice-lab/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── UserList.jsx
│   │   └── Profile.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   ├── api.js           # Axios instance
│   │   ├── authService.js   # Auth functions
│   │   └── userService.js   # User CRUD
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md (this file)
```

---

## 🔑 Key Concepts to Practice

### 1. useEffect Hook

```jsx
useEffect(() => {
  // Fetch data on mount
  fetchUsers();
}, []); // Empty array = run once
```

### 2. Axios API Calls

```jsx
const response = await axios.get("http://202.38.182.170:1348/api/users", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### 3. Context API

```jsx
const { user, login, logout } = useContext(AuthContext);
```

### 4. localStorage

```jsx
localStorage.setItem("token", jwt);
const token = localStorage.getItem("token");
```

---

## 🚀 Bonus Challenges

### Challenge 1: Search Filter

Add real-time search to filter users by name.

### Challenge 2: Role-Based UI

Show different buttons based on user role (STUDENT/ALUMNI/ADMIN).

### Challenge 3: Pagination

Implement pagination for user list (10 users per page).

### Challenge 4: Profile Picture Upload

Add image upload feature using Strapi media library.

### Challenge 5: Loading Skeletons

Replace spinners with skeleton loading screens.

---

## 📊 Grading Rubric

| Feature             | Points | Criteria                                   |
| ------------------- | ------ | ------------------------------------------ |
| **API Integration** | 25     | Successfully fetch and display users       |
| **Authentication**  | 25     | Login, register, logout working            |
| **Context API**     | 20     | Auth state shared across components        |
| **CRUD Operations** | 20     | Create, update, delete users               |
| **Error Handling**  | 10     | Graceful error messages and loading states |
| **TOTAL**           | 100    |                                            |

---

## 📚 Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [Axios Documentation](https://axios-http.com/)
- [Strapi API Reference](https://docs.strapi.io/dev-docs/api/rest)
- [Context API Guide](https://react.dev/learn/passing-data-deeply-with-context)

---

## 🆘 Troubleshooting

### CORS Errors

```bash
# Check Strapi's middleware.js has correct CORS settings
# Should allow origin: http://localhost:5173
```

### 401 Unauthorized

```bash
# Check if token is valid
console.log(localStorage.getItem('token'))

# Token might be expired, try logging in again
```

### Network Error

```bash
# Verify Strapi is running
curl http://202.38.182.170:1348/api/users

# Check your network connection
```

---

**Happy coding!** 🚀 Build amazing API-connected features!
