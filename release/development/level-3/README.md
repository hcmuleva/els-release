# 🎓 Level 3 - Context API, Backend Integration & Authentication

Master React Context for global state, build a REST API with Express.js, learn Strapi CMS, and create a full authentication system.

## 🎯 What You'll Learn

✅ **Context API** - Global state management without props drilling  
✅ **REST APIs** - Build backend with Node.js & Express  
✅ **CRUD Operations** - Create, Read, Update, Delete data  
✅ **Strapi CMS** - Headless CMS for rapid backend development  
✅ **Authentication** - Register, Login, JWT tokens  
✅ **Protected Routes** - Secure pages for authenticated users  
✅ **Environment Variables** - Secure configuration with .env files

---

## 📋 What You'll Build

A **full-stack College Member Directory** with real authentication and database:

**New in Level 3:**

- 🔐 **Register Page** - Create new user accounts
- 🔑 **Login Page** - Authenticate with email/password
- 👤 **Profile Page** - View and edit user profile
- 👥 **Users Page** - Browse all members (authenticated)
- 🌐 **REST API** - Express.js backend server
- 💾 **Strapi CMS** - Database and admin panel
- 🔒 **Protected Routes** - Pages only accessible when logged in
- 🎯 **Context Provider** - Share auth state across app

**Key Difference from Level 2:**

- **Level 2**: Static data, no backend, client-side only
- **Level 3**: Real database, authentication, full-stack application

---

## 📂 Folder Structure

```
level-3/
├── README.md                          # ⬅️ You are here
├── college-app-client-level-3/        # Frontend React app
│   ├── src/
│   │   ├── context/                   # NEW: Context providers
│   │   │   └── AuthContext.jsx        # Authentication state
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── ProtectedRoute.jsx     # NEW: Route guard
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Register.jsx           # NEW: Registration
│   │   │   ├── Login.jsx              # NEW: Login
│   │   │   ├── Profile.jsx            # NEW: User profile
│   │   │   └── Users.jsx              # NEW: All users
│   │   ├── services/                  # NEW: API calls
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                           # NEW: Environment variables
│   └── package.json
├── college-app-server/                # NEW: Backend folder
│   ├── express-api/                   # Simple Express API
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── .env
│   │   └── package.json
│   └── strapi-cms/                    # Strapi CMS (you'll create)
├── lessons/                           # Step-by-step tutorials
│   ├── lesson-3.1-context-api.md      # Context & Providers
│   ├── lesson-3.2-promises-async-await.md  # Async JavaScript
│   ├── lesson-3.3-rest-apis-express.md     # REST API & Express
│   ├── lesson-3.4-fetch-axios.md           # Making HTTP requests
│   ├── lesson-3.5-crud-frontend.md         # CRUD with React
│   ├── lesson-3.6-strapi-setup.md          # Strapi CMS intro
│   ├── lesson-3.7-authentication.md        # Login/Register
│   └── lesson-3.8-protected-routes.md      # Route guards & profile
└── practice-lab/                      # Experimental workspace
    ├── src/
    ├── package.json
    └── README.md
```

---

## 📚 Lessons (~8 hours total)

**Learning Progression:**

1. **Context API** - Learn global state management
2. **Async Fundamentals** - Master Promises & async/await (prerequisite for API calls)
3. **Build Backend** - Create REST API with Express
4. **HTTP Requests** - Learn fetch() and axios to call APIs
5. **Frontend Integration** - Connect React to your API with CRUD operations
6. **Real Database** - Switch to Strapi CMS for production-ready backend
7. **Authentication** - Add login/register with JWT
8. **Security** - Protect routes and manage user sessions

| Lesson  | Topic                      | Time   | What You'll Build                  |
| ------- | -------------------------- | ------ | ---------------------------------- |
| **3.1** | Context API & Providers    | 60 min | Theme provider, auth context       |
| **3.2** | Promises & Async/Await     | 45 min | Async JavaScript fundamentals      |
| **3.3** | REST APIs & Express.js     | 60 min | Simple Express server with routes  |
| **3.4** | fetch() vs axios           | 45 min | Make HTTP requests from React      |
| **3.5** | CRUD Operations & Frontend | 75 min | Complete CRUD with API integration |
| **3.6** | Strapi CMS Setup           | 90 min | Headless CMS, collections, content |
| **3.7** | Authentication System      | 90 min | Register/Login with JWT tokens     |
| **3.8** | Protected Routes & Profile | 60 min | Route guards, profile page, logout |

📁 All lessons in `lessons/` folder

---

## 🚀 Quick Start

### 1. Practice Lab (Learn Here First)

```bash
cd practice-lab
npm install
npm run dev
```

Open `http://localhost:5173` → Follow lessons → Experiment!

### 2. Backend Setup - Choose One:

#### Option A: Express REST API (Recommended for Beginners)

Simple Node.js server, no database required:

```bash
cd college-app-server/express-api
npm install

# Create .env file
cp .env.example .env
# Edit .env and set JWT_SECRET

# Start server
npm run dev
```

Server runs on `http://localhost:5000`  
✅ In-memory database (no setup)  
✅ Perfect for learning  
✅ All CRUD operations supported

#### Option B: Strapi CMS (Advanced)

Full headless CMS with admin panel:

```bash
cd college-app-server/strapi-cms
npm install
npm run develop
```

Admin panel: `http://localhost:1337/admin`  
✅ Real database (SQLite by default)  
✅ Admin UI for content management  
✅ Production-ready

### 3. Full Client App

Configure backend URL, then start:

```bash
cd college-app-client-level-3

# Create .env file
cp .env.example .env

# Edit .env - Choose your backend:
# VITE_API_URL=http://localhost:5000/api  (Express)
# OR
# VITE_API_URL=http://localhost:1337/api  (Strapi)

npm install
npm run dev
```

App runs on `http://localhost:5173`

**Switching Backends:**  
Just change `VITE_API_URL` in `.env` and restart the client!

---

## 🎯 Learning Path

### Coming from Level 2?

In Level 2, you learned:

- ✅ React Hooks (useState, useEffect)
- ✅ React Router for multi-page apps
- ✅ Forms with validation
- ✅ Interactive UI components

### What's New in Level 3?

Now you'll add **backend integration**:

- 🔥 **Context API** - Global state without prop drilling
- 🔥 **REST APIs** - Backend server with Express.js
- 🔥 **Database** - Real data storage with Strapi
- 🔥 **Authentication** - User accounts and login
- 🔥 **API Calls** - Fetch data from backend
- � **Environment Variables** - Secure configuration

### What You'll Build:

**Level 2 App**: Client-side only, static data  
**Level 3 App**: Full-stack with:

- ✨ User registration and login
- ✨ JWT token authentication
- ✨ Protected routes (require login)
- ✨ User profile management
- ✨ Real database with Strapi CMS
- ✨ REST API endpoints
- ✨ Postman API testing

---

## �️ The 4-Level Journey

| Level | Focus                          | App State                      |
| ----- | ------------------------------ | ------------------------------ |
| **1** | React Fundamentals             | Static components              |
| **2** | Hooks & Forms                  | Interactive, client-side only  |
| **3** | Backend & Auth ⬅️ YOU ARE HERE | Full-stack with authentication |
| **4** | Real-time & Production         | WebSockets, deployment         |

---

## 📚 Prerequisites

Before starting Level 3, you should understand:

- ✅ React hooks (useState, useEffect)
- ✅ React Router (Routes, Link, useNavigate)
- ✅ Form handling and validation
- ✅ Array methods (.map(), .filter())
- ✅ Async/await and Promises
- ✅ Basic Node.js concepts

**Not confident?** Review [Level 2 lessons](../level-2/README.md) first!

---

## 🎓 After Completing Level 3

You'll be able to:

- ✅ Build full-stack applications with React + Express/Strapi
- ✅ Implement user authentication with JWT
- ✅ Create and consume REST APIs
- ✅ Perform CRUD operations on a database
- ✅ Use Context API for global state management
- ✅ Protect routes based on authentication
- ✅ Test APIs with Postman
- ✅ Configure apps with environment variables

**Next:** [Level 4 - Real-time Features & Deployment](../level-4/README.md)

---

## � Tips for Success

1. **Follow lessons in order** - Each builds on the previous
2. **Complete both tracks** - Try Express API first, then Strapi
3. **Use Postman** - Test APIs before connecting frontend
4. **Check .env files** - Make sure ports and URLs match
5. **Read error messages** - Backend errors are very descriptive
6. **Test authentication** - Use browser DevTools to see tokens

---

## 🆘 Need Help?

- 📖 Read the lesson markdown files carefully
- 🧪 Experiment in the Practice Lab
- 👀 Check the working app for reference
- 🔍 Read Express docs: [expressjs.com](https://expressjs.com)
- 🔍 Read Strapi docs: [docs.strapi.io](https://docs.strapi.io)
- 🔍 Read Context API docs: [react.dev/reference/react/useContext](https://react.dev/reference/react/useContext)

---

## 💻 What You'll Build

**College Member Directory with Authentication:**

- 🏠 **Home Page** - Public landing page
- 📝 **Register Page** - Create account with form validation
- 🔑 **Login Page** - Authenticate and get JWT token
- 👤 **Profile Page** - View/edit your profile (protected)
- 👥 **Users Page** - Browse all members (protected)
- 🚪 **Logout** - Clear session and redirect
- 🔒 **Route Guards** - Auto-redirect if not logged in

**Backend APIs:**

- POST `/api/register` - Create new user
- POST `/api/login` - Authenticate user
- GET `/api/users` - Get all users (protected)
- GET `/api/users/:id` - Get user by ID (protected)
- PUT `/api/users/:id` - Update user (protected)
- DELETE `/api/users/:id` - Delete user (protected)

---

**Ready to build full-stack apps?** Start with [Lesson 3.1 - Context API](lessons/lesson-3.1-context-api.md)! 🚀

```
level-3/college-app-client-level-3/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Same as Level 2
│   │   ├── Hero.jsx             # Same as Level 2
│   │   ├── FeatureCard.jsx      # Same as Level 2
│   │   ├── FeatureGrid.jsx      # Same as Level 2
│   │   ├── SearchBar.jsx        # ✨ NOW WITH STATE
│   │   ├── FilterButtons.jsx    # ✨ NOW WITH STATE
│   │   ├── MemberCard.jsx       # Same as Level 2
│   │   └── MembersGrid.jsx      # ✨ NOW WITH FILTERING
│   ├── data/
│   │   └── members.js           # Same data
│   ├── App.jsx                  # ✨ NOW MANAGES STATE
│   └── App.css                  # Same styles
└── package.json
```

---

## 🔍 Key Concepts Demonstrated

### 1. **useState - Managing State**

```jsx
// Declare state variables
const [searchQuery, setSearchQuery] = useState("");
const [activeFilter, setActiveFilter] = useState("all");

// Update state
setSearchQuery("Alice"); // Triggers re-render
setActiveFilter("Student"); // Triggers re-render
```

**Why it matters:**

- When state changes, React re-renders the component
- Each component can have multiple state variables
- State is private to the component

### 2. **Controlled Inputs**

```jsx
// Level 2 (uncontrolled - React doesn't know the value)
<input type="text" />

// Level 3 (controlled - React owns the value)
<input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
```

**Benefits:**

- React always knows the current value
- Can validate/transform input
- Can reset programmatically

### 3. **useEffect - Side Effects**

```jsx
useEffect(() => {
  // This runs after render
  console.log("Search changed:", searchQuery);

  // Cleanup function (optional)
  return () => {
    console.log("Cleanup");
  };
}, [searchQuery]); // Only re-run when searchQuery changes
```

**Common uses:**

- Fetching data (we'll do this in Level 4)
- Setting up subscriptions
- Updating document title
- Timers and intervals

### 4. **Filtering Arrays**

```jsx
// Filter members based on search and role
const filteredMembers = members.filter((member) => {
  // Check if matches search query
  const matchesSearch =
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase());

  // Check if matches role filter
  const matchesRole = activeFilter === "all" || member.role === activeFilter;

  return matchesSearch && matchesRole;
});
```

### 5. **Conditional Rendering**

```jsx
// Show different UI based on state
{
  loading ? (
    <p>Loading...</p>
  ) : filteredMembers.length === 0 ? (
    <p>No members found</p>
  ) : (
    <MembersGrid members={filteredMembers} />
  );
}

// Or using &&
{
  error && <p className="error">{error}</p>;
}
```

### 6. **Lifting State Up**

```jsx
// App.jsx - Parent component holds state
function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <>
      {/* Pass state and updaters to children */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <FilterButtons active={activeFilter} onFilterChange={setActiveFilter} />
      <MembersGrid searchQuery={searchQuery} activeFilter={activeFilter} />
    </>
  );
}
```

**Why lift state up?**

- Multiple components need the same state
- Components need to communicate
- Single source of truth

---

## 🔄 Comparison: Level 2 vs Level 3

### Level 2 - Static:

```jsx
function SearchBar() {
  return <input type="text" placeholder="Search..." />;
}
// Typing does nothing!
```

### Level 3 - Interactive:

```jsx
function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search..."
    />
  );
}
// Typing updates state and filters members!
```

---

## 🎓 State Management Patterns

### Pattern 1: Simple State

```jsx
const [count, setCount] = useState(0);
setCount(count + 1); // Update to new value
```

### Pattern 2: State from Previous State

```jsx
// ✅ Good - use function when new state depends on old
setCount((prevCount) => prevCount + 1);
```

### Pattern 3: Object State

```jsx
const [formData, setFormData] = useState({
  name: "",
  email: "",
});

// Update one field
setFormData((prev) => ({
  ...prev,
  name: "Alice",
}));
```

### Pattern 4: Array State

```jsx
const [items, setItems] = useState([]);

// Add item
setItems((prev) => [...prev, newItem]);

// Remove item
setItems((prev) => prev.filter((item) => item.id !== id));

// Update item
setItems((prev) =>
  prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
);
```

---

## 💪 Challenges to Try

1. **Add a sort button** - Sort members alphabetically
2. **Add a clear button** - Reset all filters
3. **Count by role** - Show "5 Students, 3 Faculty"
4. **Highlight search terms** - Bold matching text
5. **Add a join form** - Add new members (just state, no API yet)
6. **Add loading delay** - Simulate slow search with setTimeout

---

## 🐛 Common Mistakes

### Mistake 1: Mutating State Directly

```jsx
// ❌ Wrong - mutates state
const newItems = items;
newItems.push(item);
setItems(newItems);

// ✅ Correct - create new array
setItems([...items, item]);
```

### Mistake 2: Missing Dependencies in useEffect

```jsx
// ❌ Wrong - missing searchQuery
useEffect(() => {
  filterMembers(searchQuery);
}, []);

// ✅ Correct - include all used variables
useEffect(() => {
  filterMembers(searchQuery);
}, [searchQuery]);
```

### Mistake 3: Calling Hooks Conditionally

```jsx
// ❌ Wrong - conditional hook
if (condition) {
  useState(0); // Hooks must be at top level!
}

// ✅ Correct
const [value, setValue] = useState(0);
if (condition) {
  setValue(10);
}
```

---

## 🔗 What's Next?

In **Level 4**, we'll split this into **multiple pages** and **fetch data from an API** instead of importing it locally.

[Continue to Level 4 →](../level-4/README.md)

---

## 📚 Resources

- [React Docs: State](https://react.dev/learn/state-a-components-memory)
- [React Docs: useState](https://react.dev/reference/react/useState)
- [React Docs: useEffect](https://react.dev/reference/react/useEffect)
- [React Docs: Responding to Events](https://react.dev/learn/responding-to-events)
