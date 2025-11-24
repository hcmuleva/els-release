# 📘 Lesson 1.1 - React Basics

## 🎯 Learning Objectives

By the end of this lesson, you will understand:

- What React is and why we use it
- Basic React architecture
- JSX syntax and how it differs from HTML
- Common JSX elements: headings, paragraphs, buttons, lists
- The `className` attribute

---

## 🤔 What is React?

**React** is a JavaScript library for building user interfaces. Think of it as a tool that makes creating interactive websites easier and faster.

### Why Use React?

1. **Component-Based** - Build small pieces (like LEGO blocks) and combine them
2. **Reusable** - Write once, use everywhere
3. **Fast** - React only updates what changes on the page
4. **Popular** - Used by Facebook, Instagram, Netflix, Airbnb

---

## 🏗️ Basic React Architecture

Every React app has:

```
src/
├── main.jsx          # Entry point - connects React to HTML
├── App.jsx           # Main component - your app starts here
└── index.css         # Styles
```

**How it works:**

1. Browser loads `index.html`
2. `main.jsx` tells React to render `<App />` inside `<div id="root">`
3. `App.jsx` contains your UI code
4. React displays it on the page

---

## 📝 JSX - JavaScript + HTML

**JSX** lets you write HTML-like code inside JavaScript.

### ⚠️ Important Differences from HTML:

| HTML          | JSX           | Why?                            |
| ------------- | ------------- | ------------------------------- |
| `class`       | `className`   | `class` is a JavaScript keyword |
| `for`         | `htmlFor`     | `for` is a JavaScript keyword   |
| Single quotes | Double quotes | JavaScript convention           |

---

## 🧱 Basic JSX Elements

### Headings & Paragraphs

```jsx
function App() {
  return (
    <div className="container">
      <h1>Welcome to React</h1>
      <h2>Learning JSX</h2>
      <p>This is a paragraph with some text.</p>
      <p>React makes building websites fun and easy!</p>
    </div>
  );
}
```

**🔬 Try in Practice Lab** ⬆️

---

### Buttons

```jsx
<div className="container">
  <h2>Button Demo</h2>
  <button>Click Me</button>
  <button>Submit</button>
</div>
```

**🔬 Try in Practice Lab** ⬆️

---

### Lists (ul and li)

```jsx
<div className="container">
  <h2>Programming Languages</h2>
  <ul>
    <li>JavaScript</li>
    <li>Python</li>
    <li>TypeScript</li>
  </ul>
</div>
```

**🔬 Try in Practice Lab** ⬆️

---

### Input Fields

#### Text Input

```jsx
<div className="container">
  <h2>User Form</h2>
  <label>Name:</label>
  <input type="text" placeholder="Enter your name" />
</div>
```

#### Radio Buttons

```jsx
<div className="container">
  <h2>Choose Gender</h2>
  <label>
    <input type="radio" name="gender" /> Male
  </label>
  <label>
    <input type="radio" name="gender" /> Female
  </label>
</div>
```

#### Checkbox

```jsx
<div className="container">
  <h2>Select Skills</h2>
  <label>
    <input type="checkbox" /> JavaScript
  </label>
  <label>
    <input type="checkbox" /> React
  </label>
  <label>
    <input type="checkbox" /> CSS
  </label>
</div>
```

**🔬 Try in Practice Lab** ⬆️

---

### Using className for Styling

The `className` attribute adds CSS classes to elements (same as `class` in HTML).

```jsx
<div className="container">
  <h1 className="title">Styled Heading</h1>
  <p>The container class gives us the nice white card background!</p>
</div>
```

**🔬 Try in Practice Lab** ⬆️

---

## 🎨 Complete Example - Registration Form

```jsx
function App() {
  return (
    <div className="container">
      <h1>User Registration</h1>

      <label>Full Name:</label>
      <input type="text" placeholder="John Doe" />

      <label>Email:</label>
      <input type="email" placeholder="john@example.com" />

      <h3>Gender</h3>
      <label>
        <input type="radio" name="gender" /> Male
      </label>
      <label>
        <input type="radio" name="gender" /> Female
      </label>

      <h3>Skills</h3>
      <label>
        <input type="checkbox" /> JavaScript
      </label>
      <label>
        <input type="checkbox" /> React
      </label>

      <button>Submit</button>
    </div>
  );
}

export default App;
```

**🔬 Try in Practice Lab** ⬆️

---

## ✅ Practice Exercise

Create a user profile form with:

- Name input field
- Email input field
- Role selection (Student/Teacher radio buttons)
- Skills checkboxes (3 skills)
- Submit button

---

## 🎯 Key Takeaways

✅ **JSX looks like HTML but it's JavaScript**  
✅ **Use `className` instead of `class`**  
✅ **Every component returns JSX**  
✅ **You can use `<div>`, `<h1>`, `<p>`, `<button>`, `<ul>`, `<li>` just like HTML**  
✅ **Always wrap multiple elements in a parent `<div>`**

---

## 🚀 Next Lesson

In **Lesson 1.2**, you'll learn how to use **variables** in JSX to display dynamic data!

**Preview:**

```jsx
const name = "Alice";
return <h1>Hello {name}!</h1>; // Shows: Hello Alice!
```

---

**Need Help?** Copy any code snippet above into your **Practice Lab** and experiment! 🧪
