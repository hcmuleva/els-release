# 📘 Lesson 2.2 - useState Hook

## 🎯 Learning Objectives

By the end of this lesson, you will understand:

- How to use the `useState` hook
- Creating and updating state
- Working with different data types in state
- Multiple state variables in one component
- State update best practices

---

## 🎣 What is useState?

`useState` is a hook that lets you add **state** to functional components.

**State** = Data that can change over time and causes the component to re-render.

### Basic Syntax

```jsx
import { useState } from "react";

const [stateValue, setStateValue] = useState(initialValue);
```

**Parts breakdown:**

- `stateValue` - Current state value (read this)
- `setStateValue` - Function to update state (call this to change)
- `initialValue` - Starting value when component first renders

---

## 🔢 useState with Numbers

### Example 1: Simple Counter

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default Counter;
```

**🔬 Try in Practice Lab** ⬆️

---

### Example 2: Increment by Different Amounts

```jsx
import { useState } from "react";

function FlexibleCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count + 5)}>+5</button>
      <button onClick={() => setCount(count + 10)}>+10</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default FlexibleCounter;
```

**🔬 Try in Practice Lab** ⬆️

---

## 📝 useState with Strings

### Example 3: Text Input Field

```jsx
import { useState } from "react";

function NameInput() {
  const [name, setName] = useState("");

  return (
    <div className="container">
      <h2>What's your name?</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name || "stranger"}!</p>
    </div>
  );
}

export default NameInput;
```

**🔬 Try in Practice Lab** ⬆️

**Key Concept:** `onChange` event updates state on every keystroke!

---

### Example 4: Multiple Text Inputs

```jsx
import { useState } from "react";

function FullNameForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <div className="container">
      <h2>Full Name Form</h2>

      <label>First Name:</label>
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="John"
      />

      <label>Last Name:</label>
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Doe"
      />

      <h3>
        Full Name: {firstName} {lastName}
      </h3>
    </div>
  );
}

export default FullNameForm;
```

**🔬 Try in Practice Lab** ⬆️

---

## ✅ useState with Booleans

### Example 5: Toggle Visibility

```jsx
import { useState } from "react";

function PasswordToggle() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div className="container">
      <h2>Password Input</h2>

      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />

      <button onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? "Hide" : "Show"} Password
      </button>

      <p>Password is: {showPassword ? password : "***hidden***"}</p>
    </div>
  );
}

export default PasswordToggle;
```

**🔬 Try in Practice Lab** ⬆️

---

### Example 6: Multiple Checkboxes

```jsx
import { useState } from "react";

function SkillSelector() {
  const [hasJavaScript, setHasJavaScript] = useState(false);
  const [hasReact, setHasReact] = useState(false);
  const [hasCSS, setHasCSS] = useState(false);

  return (
    <div className="container">
      <h2>Select Your Skills</h2>

      <label>
        <input
          type="checkbox"
          checked={hasJavaScript}
          onChange={(e) => setHasJavaScript(e.target.checked)}
        />
        JavaScript
      </label>

      <label>
        <input
          type="checkbox"
          checked={hasReact}
          onChange={(e) => setHasReact(e.target.checked)}
        />
        React
      </label>

      <label>
        <input
          type="checkbox"
          checked={hasCSS}
          onChange={(e) => setHasCSS(e.target.checked)}
        />
        CSS
      </label>

      <h3>Your Skills:</h3>
      <ul>
        {hasJavaScript && <li>JavaScript ✅</li>}
        {hasReact && <li>React ✅</li>}
        {hasCSS && <li>CSS ✅</li>}
      </ul>
    </div>
  );
}

export default SkillSelector;
```

**🔬 Try in Practice Lab** ⬆️

---

## 🎯 useState with Objects

### Example 7: User Object State

```jsx
import { useState } from "react";

function UserProfile() {
  const [user, setUser] = useState({
    name: "Alice",
    age: 25,
    email: "alice@example.com",
  });

  const updateName = (newName) => {
    setUser({ ...user, name: newName });
  };

  const updateAge = (newAge) => {
    setUser({ ...user, age: newAge });
  };

  return (
    <div className="container">
      <h2>User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <p>Email: {user.email}</p>

      <button onClick={() => updateName("Bob")}>Change Name to Bob</button>
      <button onClick={() => updateAge(30)}>Set Age to 30</button>
    </div>
  );
}

export default UserProfile;
```

**🔬 Try in Practice Lab** ⬆️

**Important:** Use spread operator `...user` to keep other properties!

---

### Example 8: Form with Object State

```jsx
import { useState } from "react";

function UserForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    age: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container">
      <h2>Registration Form</h2>

      <label>Username:</label>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />

      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <label>Age:</label>
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
      />

      <h3>Form Data:</h3>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
}

export default UserForm;
```

**🔬 Try in Practice Lab** ⬆️

---

## 📚 useState with Arrays

### Example 9: Adding Items to a List

```jsx
import { useState } from "react";

function TodoList() {
  const [todos, setTodos] = useState(["Learn React", "Build app"]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo]);
      setNewTodo("");
    }
  };

  return (
    <div className="container">
      <h2>Todo List</h2>

      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Enter new todo"
      />
      <button onClick={addTodo}>Add Todo</button>

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
```

**🔬 Try in Practice Lab** ⬆️

---

### Example 10: Removing Items from Array

```jsx
import { useState } from "react";

function NameList() {
  const [names, setNames] = useState(["Alice", "Bob", "Charlie"]);

  const removeName = (indexToRemove) => {
    setNames(names.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="container">
      <h2>Name List</h2>

      <ul>
        {names.map((name, index) => (
          <li key={index}>
            {name}
            <button onClick={() => removeName(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NameList;
```

**🔬 Try in Practice Lab** ⬆️

---

## ⚡ State Update Best Practices

### ❌ Don't Mutate State Directly

```jsx
// ❌ WRONG - Mutating state
const [user, setUser] = useState({ name: "Alice" });
user.name = "Bob"; // DON'T DO THIS!

// ✅ CORRECT - Create new object
setUser({ ...user, name: "Bob" });
```

### ❌ Don't Rely on Previous State in Updates

```jsx
// ❌ WRONG - If multiple updates happen, this can fail
setCount(count + 1);
setCount(count + 1); // May not increment twice!

// ✅ CORRECT - Use function form
setCount((prevCount) => prevCount + 1);
setCount((prevCount) => prevCount + 1); // Works correctly!
```

---

## 🎨 Complete Example: All Together

```jsx
import { useState } from "react";

function CompleteDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [skills, setSkills] = useState(["React", "JavaScript"]);

  return (
    <div className="container">
      <h1>useState Complete Demo</h1>

      {/* Number state */}
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>+1</button>

      {/* String state */}
      <h2>Name Input</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>Hello, {name}!</p>

      {/* Boolean state */}
      <button onClick={() => setIsVisible(!isVisible)}>Toggle Content</button>
      {isVisible && <p>This content can be hidden!</p>}

      {/* Array state */}
      <h2>Skills</h2>
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
}

export default CompleteDemo;
```

**🔬 Try in Practice Lab** ⬆️

---

## ✅ Practice Exercise

Build a **Student Registration Form** with useState:

1. Name input (string)
2. Age input (number)
3. Email input (string)
4. "Graduated" checkbox (boolean)
5. Display all values below the form
6. Add a "Clear Form" button that resets everything

---

## 🎯 Key Takeaways

✅ **`useState` creates state in functional components**  
✅ **Always use the setter function to update state**  
✅ **Never mutate state directly**  
✅ **Use spread operator `...` for objects and arrays**  
✅ **Each state variable is independent**  
✅ **State updates cause re-renders**

---

## 🚀 Next Lesson

In **Lesson 2.3**, you'll learn the **`useEffect` hook** for:

- Running code after rendering
- Fetching data from APIs
- Setting up timers
- Cleanup functions

**Preview:**

```jsx
useEffect(() => {
  console.log("Component rendered!");
}, []);
```

---

**Need Help?** Copy any code snippet above into your **Practice Lab** and experiment! 🧪
