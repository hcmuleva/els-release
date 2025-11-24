# 📘 Lesson 2.1 - Introduction to React Hooks

## 🎯 Learning Objectives

By the end of this lesson, you will understand:

- What React Hooks are and why they exist
- The rules of using hooks
- Overview of common hooks
- When to use hooks vs props

---

## 🤔 What Are React Hooks?

**Hooks** are special functions that let you "hook into" React features like state and lifecycle methods.

### Before Hooks (Old Way - Class Components)

```jsx
// ❌ Old way - Complex class syntax
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return <button>{this.state.count}</button>;
  }
}
```

### With Hooks (Modern Way - Functional Components)

```jsx
// ✅ New way - Simple and clean
function Counter() {
  const [count, setCount] = useState(0);

  return <button>{count}</button>;
}
```

---

## 🎣 Why Were Hooks Invented?

### Problems Hooks Solve:

1. **Complexity** - Class components were hard to understand
2. **Reusing Logic** - Hard to share stateful logic between components
3. **Big Components** - Components grew too large with mixed concerns
4. **Confusing `this`** - JavaScript's `this` keyword was tricky

### Benefits of Hooks:

✅ **Simpler Code** - No classes, no `this`  
✅ **Reusable Logic** - Extract and share logic easily  
✅ **Better Organization** - Group related code together  
✅ **Easier to Learn** - Just functions!

---

## 📜 Rules of Hooks

**You MUST follow these rules:**

### Rule 1: Only Call Hooks at the Top Level

❌ **Don't** call hooks inside loops, conditions, or nested functions:

```jsx
function BadComponent() {
  if (someCondition) {
    const [count, setCount] = useState(0); // ❌ WRONG!
  }
}
```

✅ **Do** call hooks at the top of your component:

```jsx
function GoodComponent() {
  const [count, setCount] = useState(0); // ✅ CORRECT!

  if (someCondition) {
    // Use the hook result here
  }
}
```

### Rule 2: Only Call Hooks from React Functions

✅ **Call hooks from:**

- React functional components
- Custom hooks (we'll learn later)

❌ **Don't call hooks from:**

- Regular JavaScript functions
- Class components

---

## 🧰 Common React Hooks Overview

Here are the main hooks you'll learn in this level:

### 1. `useState` - Manage State

Store and update data in your component.

```jsx
const [count, setCount] = useState(0);
const [name, setName] = useState("");
const [isVisible, setIsVisible] = useState(false);
```

**Use for:** Any data that changes over time

---

### 2. `useEffect` - Side Effects

Run code after rendering (fetch data, timers, subscriptions).

```jsx
useEffect(() => {
  // This runs after render
  console.log("Component rendered!");
}, []);
```

**Use for:** Data fetching, subscriptions, manually changing the DOM

---

### 3. `useRef` - Persist Values

Keep a mutable value that doesn't cause re-renders.

```jsx
const inputRef = useRef(null);

// Access DOM element
inputRef.current.focus();
```

**Use for:** Accessing DOM elements, storing mutable values

---

### 4. `useMemo` - Optimize Performance

Remember expensive calculations.

```jsx
const expensiveResult = useMemo(() => {
  return calculateSomethingExpensive(data);
}, [data]);
```

**Use for:** Performance optimization

---

### 5. `useCallback` - Memoize Functions

Remember function instances (prevents re-creating on every render).

```jsx
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

**Use for:** Passing callbacks to optimized child components

---

## 🎯 Hooks vs Props - When to Use What?

### Use **Props** when:

- ✅ Passing data from parent to child
- ✅ Data comes from outside the component
- ✅ Read-only data

```jsx
function UserCard({ name, age }) {
  // name and age are props
  return (
    <div>
      {name} - {age}
    </div>
  );
}
```

### Use **Hooks (State)** when:

- ✅ Data changes inside the component
- ✅ User interactions update data
- ✅ Component needs to remember something

```jsx
function Counter() {
  const [count, setCount] = useState(0); // Hook

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

## 🔬 Simple Hook Example

Let's see a complete example using a hook:

```jsx
import { useState } from "react";

function ToggleButton() {
  // useState hook - creates state variable
  const [isOn, setIsOn] = useState(false);

  // Event handler function
  const handleToggle = () => {
    setIsOn(!isOn); // Toggle between true/false
  };

  return (
    <div className="container">
      <h2>Toggle Demo</h2>
      <button onClick={handleToggle}>{isOn ? "ON ✅" : "OFF ❌"}</button>
      <p>The button is {isOn ? "ON" : "OFF"}</p>
    </div>
  );
}

export default ToggleButton;
```

**🔬 Try in Practice Lab** ⬆️

### What Happens:

1. `useState(false)` creates state starting at `false`
2. `isOn` holds the current value
3. `setIsOn` is a function to update the value
4. Clicking button calls `setIsOn(!isOn)` - toggles value
5. React re-renders with new value

---

## 🎨 Practice Examples

### Example 1: Show/Hide Content

```jsx
import { useState } from "react";

function ShowHideDemo() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="container">
      <h2>Show/Hide Demo</h2>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "Hide" : "Show"} Content
      </button>

      {isVisible && <p>This content can be toggled on and off!</p>}
    </div>
  );
}

export default ShowHideDemo;
```

**🔬 Try in Practice Lab** ⬆️

---

### Example 2: Multiple Toggle Buttons

```jsx
import { useState } from "react";

function MultipleToggles() {
  const [showTitle, setShowTitle] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showImage, setShowImage] = useState(false);

  return (
    <div className="container">
      <h2>Multiple Toggles</h2>

      <button onClick={() => setShowTitle(!showTitle)}>Toggle Title</button>
      <button onClick={() => setShowDescription(!showDescription)}>
        Toggle Description
      </button>
      <button onClick={() => setShowImage(!showImage)}>Toggle Image</button>

      {showTitle && <h3>Welcome to React Hooks!</h3>}
      {showDescription && <p>Hooks make React development easier.</p>}
      {showImage && <div className="image-placeholder">📸 Image Here</div>}
    </div>
  );
}

export default MultipleToggles;
```

**🔬 Try in Practice Lab** ⬆️

---

## ✅ Practice Exercise

Create a component with three buttons that each toggle different messages:

1. Button 1: Shows "Hello World!"
2. Button 2: Shows "React is awesome!"
3. Button 3: Shows "I'm learning hooks!"

Each button should independently show/hide its message.

---

## 🎯 Key Takeaways

✅ **Hooks are functions that add React features to functional components**  
✅ **Always call hooks at the top level of your component**  
✅ **`useState` is for data that changes**  
✅ **Props are for data passed from parent**  
✅ **Hooks make code simpler than class components**  
✅ **React re-renders when state changes**

---

## 🚀 Next Lesson

In **Lesson 2.2**, you'll dive deep into the **`useState` hook** and learn:

- How to create and update state
- Multiple state variables
- Working with different data types (strings, numbers, objects, arrays)
- Building a counter and input field

**Preview:**

```jsx
const [count, setCount] = useState(0);
const [name, setName] = useState("");
const [user, setUser] = useState({ name: "Alice", age: 25 });
```

---

**Need Help?** Copy any code snippet above into your **Practice Lab** and experiment! 🧪
