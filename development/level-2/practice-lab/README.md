# Level 2 Practice Lab

## 🎯 Overview

This practice lab reinforces the concepts learned in **Level 2** by providing hands-on exercises with **React Hooks** (`useState`, `useEffect`). Build interactive components with real state management!

---

## 📚 Prerequisites

Before starting, complete:

- ✅ Level 1 (JSX, props, lists, conditionals)
- ✅ Level 2 Lessons 2.1-2.4

---

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd practice-lab
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:5173

---

## 🎓 Lab Exercises

### Exercise 1: Counter with useState

**Goal**: Create an interactive counter using `useState` hook

**Tasks**:

1. ✅ Import `useState` from React
2. ✅ Initialize count state with 0
3. ✅ Create increment button
4. ✅ Create decrement button
5. ✅ Add reset button

**Example**:

```jsx
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h1>Counter</h1>
      <p className="count">Count: {count}</p>
      <div className="button-group">
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <button onClick={() => setCount(count - 1)}>Decrement</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </div>
  );
}
```

---

### Exercise 2: Input Form with State

**Goal**: Capture and display user input

**Tasks**:

1. ✅ Create text input field
2. ✅ Store input value in state
3. ✅ Display typed value below input
4. ✅ Add character count
5. ✅ Clear input button

**Example**:

```jsx
import { useState } from "react";

function App() {
  const [text, setText] = useState("");

  return (
    <div className="container">
      <h1>Text Input</h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />
      <p>You typed: {text}</p>
      <p>Characters: {text.length}</p>
      <button onClick={() => setText("")}>Clear</button>
    </div>
  );
}
```

---

### Exercise 3: Todo List

**Goal**: Build a simple todo list with add/remove functionality

**Tasks**:

1. ✅ Create array state for todos
2. ✅ Add input for new todo
3. ✅ Add button to add todo
4. ✅ Display todos in a list
5. ✅ Add delete button for each todo

**Example**:

```jsx
import { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input }]);
      setInput("");
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Exercise 4: Toggle Visibility

**Goal**: Show/hide content using boolean state

**Tasks**:

1. ✅ Create boolean state `isVisible`
2. ✅ Toggle button to change state
3. ✅ Conditionally render content
4. ✅ Change button text based on state
5. ✅ Add smooth transitions

**Example**:

```jsx
import { useState } from "react";

function App() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="container">
      <h1>Toggle Content</h1>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "Hide" : "Show"} Content
      </button>
      {isVisible && (
        <div className="content-box">
          <p>This content can be toggled!</p>
        </div>
      )}
    </div>
  );
}
```

---

### Exercise 5: Multiple State Variables

**Goal**: Manage multiple pieces of state

**Tasks**:

1. ✅ Create form with name, email, age
2. ✅ Each field has its own state
3. ✅ Display all values below form
4. ✅ Validate age (number only)
5. ✅ Reset all fields button

**Example**:

```jsx
import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  const reset = () => {
    setName("");
    setEmail("");
    setAge("");
  };

  return (
    <div className="container">
      <h1>User Form</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Age"
      />
      <button onClick={reset}>Reset</button>

      <div className="info-box">
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Age:</strong> {age}
        </p>
      </div>
    </div>
  );
}
```

---

### Exercise 6: useEffect Hook

**Goal**: Run side effects with `useEffect`

**Tasks**:

1. ✅ Import `useEffect` from React
2. ✅ Update document title on count change
3. ✅ Log to console on mount
4. ✅ Cleanup on unmount
5. ✅ Run effect only when specific state changes

**Example**:

```jsx
import { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Runs after every render when count changes
    document.title = `Count: ${count}`;
    console.log("Count changed to:", count);
  }, [count]); // Dependency array

  useEffect(() => {
    // Runs only once on mount
    console.log("Component mounted!");

    return () => {
      // Cleanup on unmount
      console.log("Component will unmount!");
    };
  }, []); // Empty array = run once

  return (
    <div className="container">
      <h1>useEffect Example</h1>
      <p>Count: {count}</p>
      <p>Check the browser tab title!</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

## 📖 How to Use This Lab

1. Open a lesson from `lessons/` folder
2. Find code marked with **🔬 Try in Practice Lab**
3. Copy the code snippet
4. Open `src/App.jsx` in this directory
5. Replace the content with your code
6. Save and watch it update automatically!

---

## 🧪 Testing Checklist

- [ ] Counter increments and decrements correctly
- [ ] Input value updates as you type
- [ ] Todos can be added and removed
- [ ] Toggle shows/hides content
- [ ] Form captures all field values
- [ ] useEffect runs at correct times
- [ ] No console errors (F12)

---

## 🚀 Bonus Challenges

### Challenge 1: Advanced Counter

Add increment by 5, decrement by 5, and double/half buttons.

### Challenge 2: Todo with Complete

Add checkbox to mark todos as complete with strikethrough styling.

### Challenge 3: Character Limit

Add character limit to text input (e.g., max 50 characters).

### Challenge 4: Filter Todos

Add buttons to filter todos: All, Active, Completed.

### Challenge 5: Local Storage

Use `useEffect` to save todos to localStorage and load on mount.

### Challenge 6: Timer

Create a countdown timer using `useState` and `useEffect` with `setInterval`.

---

## 📚 Key Concepts

### useState Hook

```jsx
const [state, setState] = useState(initialValue);

// Update state
setState(newValue);

// Update based on previous state
setState((prev) => prev + 1);
```

### useEffect Hook

```jsx
useEffect(() => {
  // Effect code

  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]);

// Run once on mount
useEffect(() => { ... }, []);

// Run on every render
useEffect(() => { ... });

// Run when 'count' changes
useEffect(() => { ... }, [count]);
```

### Event Handlers

```jsx
<button onClick={() => setCount(count + 1)}>Click</button>
<input onChange={(e) => setText(e.target.value)} />
<form onSubmit={(e) => { e.preventDefault(); ... }}>
```

### Array State Updates

```jsx
// Add item
setItems([...items, newItem]);

// Remove item
setItems(items.filter((item) => item.id !== id));

// Update item
setItems(
  items.map((item) => (item.id === id ? { ...item, completed: true } : item))
);
```

---

## 💡 Tips

- **State is Immutable**: Never modify state directly, always use setter
- **Functional Updates**: Use `setState(prev => ...)` when new state depends on old
- **Effect Dependencies**: Always include variables used in effect in dependency array
- **Cleanup Effects**: Return cleanup function for timers, subscriptions
- **Component Re-renders**: State changes trigger re-renders

---

## 🔄 Reset to Default

If you need to start fresh, reset `src/App.jsx`:

```jsx
import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h1>🧪 Level 2 Practice Lab</h1>
      <p className="subtitle">Welcome to your React Hooks sandbox!</p>

      <div className="example-box">
        <h2>Example: Counter</h2>
        <p className="count">Count: {count}</p>
        <div className="button-group">
          <button onClick={() => setCount(count + 1)}>Increment</button>
          <button onClick={() => setCount(count - 1)}>Decrement</button>
          <button onClick={() => setCount(0)}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default App;
```

---

## 📂 Project Structure

```
practice-lab/
├── src/
│   ├── App.jsx        # Your code here
│   ├── App.css        # Styling for your components
│   ├── index.css      # Global styles
│   └── main.jsx       # Entry point (don't modify)
├── index.html
├── package.json
└── README.md (this file)
```

---

## 🎨 Pre-Styled Elements

The lab includes CSS for:

- `.container` - Main wrapper
- `.example-box` - Card-style boxes
- `.button-group` - Flexbox button layout
- `.count` - Large number display
- Form elements - Styled inputs
- Buttons with hover effects

---

## 🆘 Troubleshooting

### State not updating

- Check you're using setter function: `setState(newValue)`
- For arrays/objects, create new reference: `[...array]` or `{...object}`

### Infinite loop with useEffect

- Missing dependency array: add `[]`
- State update inside effect without dependencies

### "Too many re-renders"

- Calling setter in render instead of event handler
- Should be: `onClick={() => setCount(0)}` not `onClick={setCount(0)}`

---

## 📊 Grading Rubric

| Feature            | Points | Criteria                                |
| ------------------ | ------ | --------------------------------------- |
| **useState**       | 30     | Correctly manage state in components    |
| **Event Handlers** | 20     | Handle clicks, inputs, form submissions |
| **useEffect**      | 25     | Run effects with proper dependencies    |
| **Array State**    | 15     | Add, remove, update items in arrays     |
| **UI Updates**     | 10     | Components re-render correctly          |
| **TOTAL**          | 100    |                                         |

---

## 📚 Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [useState Reference](https://react.dev/reference/react/useState)
- [useEffect Reference](https://react.dev/reference/react/useEffect)
- [React Dev Tools](https://react.dev/learn/react-developer-tools)

---

**Happy Coding!** 🚀 Master React Hooks before moving to Level 3!
