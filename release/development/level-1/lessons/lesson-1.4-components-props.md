# 📘 Lesson 1.4 - Components & Props

## 🎯 Learning Objectives

By the end of this lesson, you will understand:

- What components are and why they're important
- How to create components in the same file
- How to create separate component files
- What props are and how to pass data between components
- Import/export syntax
- Using ES7 React snippets for faster coding

---

## 🧩 What are Components?

**Components** are like LEGO blocks for your website. Instead of writing all code in one place, you break it into small, reusable pieces.

### Think of it like building a house:

- 🏠 House = App
- 🚪 Door = Header component
- 🪟 Window = Card component
- 🔲 Brick = Button component

You build small pieces, then combine them to make something bigger!

---

## 🤔 Why Use Components?

### Without Components (❌ Bad):

```jsx
function App() {
  return (
    <div>
      <div className="user-card">
        <h2>Alice</h2>
        <p>Age: 25</p>
      </div>
      <div className="user-card">
        <h2>Bob</h2>
        <p>Age: 30</p>
      </div>
      <div className="user-card">
        <h2>Charlie</h2>
        <p>Age: 22</p>
      </div>
      {/* Repeating the same code! */}
    </div>
  );
}
```

### With Components (✅ Good):

```jsx
function App() {
  return (
    <div>
      <UserCard name="Alice" age={25} />
      <UserCard name="Bob" age={30} />
      <UserCard name="Charlie" age={22} />
    </div>
  );
}
```

**Benefits:**

- ✅ No repetition
- ✅ Easy to update
- ✅ Reusable
- ✅ Cleaner code

---

## 📝 Step 1: Components in the Same File

Let's start simple - creating a component in `App.jsx`.

### Example 1: Basic User Card Component

```jsx
// Component function (starts with capital letter!)
function UserCard() {
  return (
    <div>
      <h2>Alice</h2>
      <p>Age: 25</p>
    </div>
  );
}

// Main App component
function App() {
  return (
    <div className="container">
      <h1>Team Members</h1>
      <UserCard />
      <UserCard />
      <UserCard />
    </div>
  );
}

export default App;
```

**🔬 Try in Practice Lab** ⬆️

**Problem:** All cards show the same data! We need **props**.

---

## 🎁 What are Props?

**Props** (short for "properties") let you pass data from parent to child component.

Think of props like function parameters:

```javascript
// Regular function
function greet(name) {
  return "Hello " + name;
}

// React component with props
function Greeting(props) {
  return <h1>Hello {props.name}</h1>;
}
```

---

## 📦 Step 2: Using Props

### Example 2: Using Props (Destructured)

```jsx
// ✅ Component with props
function UserCard({ name, age, role }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>
        Age: {age} | Role: {role}
      </p>
    </div>
  );
}

// App passes data via props
function App() {
  return (
    <div className="container">
      <h1>Team Members</h1>
      <UserCard name="Alice" age={25} role="Developer" />
      <UserCard name="Bob" age={30} role="Designer" />
    </div>
  );
}

export default App;
```

**🔬 Try in Practice Lab** ⬆️

---

## 🗂️ Step 3: Separate Component Files

**Problem:** Keeping everything in `App.jsx` gets messy!

**Solution:** Create separate files for each component.

---

### 📁 Folder Structure

```
src/
├── components/
│   ├── UserCard.jsx
│   └── ProductCard.jsx
├── App.jsx
└── main.jsx
```

---

### Creating a Component File

**File: `src/components/UserCard.jsx`**

```jsx
function UserCard({ name, age, role }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Role: {role}</p>
    </div>
  );
}

export default UserCard;
```

**Key points:**

1. ✅ File name matches component name
2. ✅ Component name starts with capital letter
3. ✅ Must `export default` the component

---

### Importing the Component

**File: `src/App.jsx`**

```jsx
import UserCard from "./components/UserCard";

function App() {
  return (
    <div className="container">
      <h1>Team Directory</h1>
      <UserCard name="Alice" age={25} role="Developer" />
      <UserCard name="Bob" age={30} role="Designer" />
    </div>
  );
}

export default App;
```

**Key points:**

1. ✅ Import at the top of file
2. ✅ Use `./` for relative path
3. ✅ No `.jsx` extension needed

---

## 🎨 Complete Example: User List with Components

**File: `src/components/UserCard.jsx`**

```jsx
function UserCard({ name, age, role }) {
  return (
    <div
      style={{
        border: "2px solid #667eea",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "10px",
      }}
    >
      <h2>{name}</h2>
      <p>
        Age: {age} | Role: {role}
      </p>
    </div>
  );
}

export default UserCard;
```

**File: `src/App.jsx`**

```jsx
import UserCard from "./components/UserCard";

function App() {
  const users = [
    { id: 1, name: "Alice", age: 25, role: "Developer" },
    { id: 2, name: "Bob", age: 30, role: "Designer" },
  ];

  return (
    <div className="container">
      <h1>Team Directory</h1>
      {users.map((user) => (
        <UserCard key={user.id} {...user} />
      ))}
    </div>
  );
}

export default App;
```

---

## ⚡ ES7 React Snippets Extension

### 🔌 Install the Extension

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search: **"ES7+ React/Redux/React-Native snippets"**
4. Install by **dsznajder**

### 🚀 Useful Shortcuts

| Shortcut | Creates                    |
| -------- | -------------------------- |
| `rfc`    | React Functional Component |
| `rfce`   | Component with export      |
| `rafc`   | Arrow Function Component   |
| `imp`    | Import statement           |
| `imr`    | Import React               |

---

### Using `rfc` Shortcut

**Step 1:** Create new file `UserCard.jsx`

**Step 2:** Type `rfc` and press Enter

**Result:** Auto-generates:

```jsx
import React from "react";

export default function UserCard() {
  return <div>UserCard</div>;
}
```

**Step 3:** Add your props and JSX!

```jsx
export default function UserCard({ name, age }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
}
```

---

## ✅ Practice Exercise

Create a `ProductCard` component in a separate file with props:

- `name`, `price`, `inStock` (boolean)

Use it in App.jsx to display 3 products using `.map()`

**Bonus:** Add conditional styling - green border if in stock, red if not.

---

## 🎯 Key Takeaways

✅ **Components are reusable pieces of UI**  
✅ **Component names start with capital letter**  
✅ **Props pass data from parent to child**  
✅ **Destructure props for cleaner code: `{ name, age }`**  
✅ **Create separate files in `components/` folder**  
✅ **Import: `import Card from './components/Card'`**  
✅ **Export: `export default Card`**  
✅ **Use ES7 snippets: Type `rfc` + Enter**  
✅ **Always add `key` prop when using `.map()`**

---

## 🎉 Congratulations!

You've completed Level 1! You now know:

- ✅ React basics and JSX
- ✅ Variables and data types
- ✅ Array methods (map, filter, reduce)
- ✅ Components and props

You're ready to build real React applications! 🚀

---

## 🚀 Next Steps

**Level 2** will teach you:

- React Hooks (useState, useEffect)
- Managing state and interactivity
- Forms and user input
- Fetching data from APIs

---

**Need Help?** Copy the examples into your **Practice Lab** and experiment! 🧪
