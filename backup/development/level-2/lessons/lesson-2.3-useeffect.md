# 📘 Lesson 2.3 - useEffect Hook

## 🎯 Learning Objectives

By the end of this lesson, you will understand:

- What side effects are in React
- How to use the `useEffect` hook
- The dependency array and when code runs
- Cleanup functions
- Common useEffect patterns

---

## 🤔 What Are Side Effects?

**Side effects** are operations that affect things outside the component:

- 🌐 Fetching data from an API
- ⏰ Setting up timers/intervals
- 📡 Subscribing to external data sources
- 📝 Updating the document title
- 💾 Writing to localStorage

**Why a special hook?** React components should be "pure" - they shouldn't have side effects in the main function body.

---

## 🎣 What is useEffect?

`useEffect` lets you run code **after** your component renders.

### Basic Syntax

```jsx
import { useEffect } from "react";

useEffect(() => {
  // Your side effect code here
  console.log("Component rendered!");
}, [dependencies]);
```

**Parts breakdown:**

- **Function** - Code to run (the effect)
- **Dependency array** - Controls when effect runs

---

## 🔄 When Does useEffect Run?

### 1. Run on Every Render (No Dependencies)

```jsx
import { useState, useEffect } from "react";

function EveryRender() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Runs on EVERY render");
  }); // No dependency array

  return (
    <div className="container">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default EveryRender;
```

**🔬 Try in Practice Lab** ⬆️  
**Check console** - You'll see the message every time you click!

---

### 2. Run Only Once on Mount (Empty Dependencies)

```jsx
import { useState, useEffect } from "react";

function OnceOnMount() {
  const [data, setData] = useState("Loading...");

  useEffect(() => {
    console.log("Runs ONLY ONCE when component mounts");
    setData("Data loaded!");
  }, []); // Empty array = run once

  return (
    <div className="container">
      <h2>{data}</h2>
    </div>
  );
}

export default OnceOnMount;
```

**🔬 Try in Practice Lab** ⬆️

**Use case:** Data fetching when component first appears

---

### 3. Run When Specific Values Change

```jsx
import { useState, useEffect } from "react";

function WatchCount() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("Count changed to:", count);
    setMessage(`Count is now ${count}`);
  }, [count]); // Runs when count changes

  return (
    <div className="container">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>{message}</p>
    </div>
  );
}

export default WatchCount;
```

**🔬 Try in Practice Lab** ⬆️

---

## ⏰ useEffect with Timers

### Example 1: Auto Counter

```jsx
import { useState, useEffect } from "react";

function AutoCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    // Cleanup function
    return () => clearInterval(timer);
  }, []); // Empty array = setup once

  return (
    <div className="container">
      <h2>Auto Counter: {count}</h2>
      <p>Increments every second automatically!</p>
    </div>
  );
}

export default AutoCounter;
```

**🔬 Try in Practice Lab** ⬆️

**Important:** The `return` statement is a **cleanup function** - it runs when the component unmounts!

---

### Example 2: Countdown Timer

```jsx
import { useState, useEffect } from "react";

function Countdown() {
  const [seconds, setSeconds] = useState(10);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <div className="container">
      <h2>Countdown: {seconds}s</h2>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? "Pause" : "Start"}
      </button>
      <button onClick={() => setSeconds(10)}>Reset</button>
    </div>
  );
}

export default Countdown;
```

**🔬 Try in Practice Lab** ⬆️

---

## 📝 useEffect with Document Title

### Example 3: Dynamic Page Title

```jsx
import { useState, useEffect } from "react";

function DynamicTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <div className="container">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Look at the browser tab title! 👆</p>
    </div>
  );
}

export default DynamicTitle;
```

**🔬 Try in Practice Lab** ⬆️

---

## 🌐 useEffect with Data Fetching

### Example 4: Fetch User Data (Simulated)

```jsx
import { useState, useEffect } from "react";

function UserLoader() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      setUser({
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "Student",
      });
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h2>Loading user data...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>User Profile</h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
    </div>
  );
}

export default UserLoader;
```

**🔬 Try in Practice Lab** ⬆️

---

### Example 5: Fetch Based on User Input

```jsx
import { useState, useEffect } from "react";

function SearchUser() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const users = {
        1: { name: "Alice", role: "Student" },
        2: { name: "Bob", role: "Alumni" },
        3: { name: "Charlie", role: "Admin" },
      };

      setUser(users[userId] || { name: "Not found", role: "N/A" });
      setLoading(false);
    }, 1000);
  }, [userId]); // Re-fetch when userId changes

  return (
    <div className="container">
      <h2>Search User</h2>

      <label>User ID:</label>
      <input
        type="number"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        min="1"
        max="3"
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        user && (
          <div>
            <h3>{user.name}</h3>
            <p>Role: {user.role}</p>
          </div>
        )
      )}
    </div>
  );
}

export default SearchUser;
```

**🔬 Try in Practice Lab** ⬆️

---

## 💾 useEffect with localStorage

### Example 6: Persist Counter Value

```jsx
import { useState, useEffect } from "react";

function PersistentCounter() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem("count");
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("count", count);
  }, [count]);

  return (
    <div className="container">
      <h2>Persistent Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <p>Refresh the page - the count persists!</p>
    </div>
  );
}

export default PersistentCounter;
```

**🔬 Try in Practice Lab** ⬆️

---

## 🧹 Cleanup Functions

### Why Cleanup?

Prevent memory leaks by cleaning up:

- Timers (clearInterval, clearTimeout)
- Event listeners
- Subscriptions
- Network requests

### Example 7: Window Resize Listener

```jsx
import { useState, useEffect } from "react";

function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup: remove listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="container">
      <h2>Window Width: {width}px</h2>
      <p>Resize your browser window!</p>
    </div>
  );
}

export default WindowSize;
```

**🔬 Try in Practice Lab** ⬆️

---

## ⚡ Common Patterns & Best Practices

### ❌ Don't Put Everything in One useEffect

```jsx
// ❌ BAD - Too many responsibilities
useEffect(() => {
  fetchUser();
  updateTitle();
  startTimer();
}, []);
```

### ✅ Separate Concerns

```jsx
// ✅ GOOD - Each effect has one purpose
useEffect(() => {
  fetchUser();
}, []);

useEffect(() => {
  document.title = `User: ${username}`;
}, [username]);

useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);
```

---

### ❌ Don't Forget Dependencies

```jsx
// ❌ BAD - Missing dependency
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(count);
}, []); // count is used but not in dependencies!
```

### ✅ Include All Dependencies

```jsx
// ✅ GOOD - All dependencies listed
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(count);
}, [count]); // count is in dependencies
```

---

## 🎨 Complete Example: User Dashboard

```jsx
import { useState, useEffect } from "react";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlineTime, setOnlineTime] = useState(0);

  // Fetch user data on mount
  useEffect(() => {
    setTimeout(() => {
      setUser({ name: "Alice", role: "Student" });
      setLoading(false);
    }, 1500);
  }, []);

  // Update document title
  useEffect(() => {
    if (user) {
      document.title = `Dashboard - ${user.name}`;
    }
  }, [user]);

  // Track online time
  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Welcome, {user.name}!</h1>
      <p>Role: {user.role}</p>
      <p>Time online: {onlineTime} seconds</p>
    </div>
  );
}

export default UserDashboard;
```

**🔬 Try in Practice Lab** ⬆️

---

## ✅ Practice Exercise

Build a **Real-Time Clock** component:

1. Display current time (HH:MM:SS)
2. Update every second
3. Show date (Day, Month DD, YYYY)
4. Add a "Pause" button to stop/start the clock
5. Don't forget cleanup!

---

## 🎯 Key Takeaways

✅ **`useEffect` runs code after rendering**  
✅ **Empty `[]` = run once on mount**  
✅ **`[value]` = run when value changes**  
✅ **No array = run on every render**  
✅ **Return a function for cleanup**  
✅ **Always include all dependencies**  
✅ **Separate effects by concern**

---

## 🚀 Next Lesson

In **Lesson 2.4**, you'll combine `useState` and `useEffect` to build **complete forms**:

- Multi-field registration forms
- Form validation
- Controlled vs uncontrolled components
- Submit handling

**Preview:**

```jsx
const [formData, setFormData] = useState({ name: "", email: "" });

const handleSubmit = (e) => {
  e.preventDefault();
  // Process form data
};
```

---

**Need Help?** Copy any code snippet above into your **Practice Lab** and experiment! 🧪
