# 🧱 Iteration 6: React Components

## 🎯 Goal
Learn to create reusable React components and understand component composition.

## 📚 What You'll Learn
- What are components and why use them
- Creating functional components
- Component composition (nesting components)
- Importing and exporting components
- Props basics (passing data to components)
- Styling components

## 🚀 Setup
```bash
# Create new React app for this iteration
npm create vite@latest react-components-app -- --template react
cd react-components-app
npm install
npm run dev
```

## 📝 Key Concepts

### What is a Component?
A component is a **reusable piece of UI**. Think of it as a custom HTML element.

Instead of writing:
```html
<div class="card">
  <h2>John Doe</h2>
  <p>Developer</p>
</div>
```

You create a component:
```javascript
function ProfileCard() {
  return (
    <div className="card">
      <h2>John Doe</h2>
      <p>Developer</p>
    </div>
  );
}
```

### Creating Components

**Option 1: Function Declaration**
```javascript
function Welcome() {
  return <h1>Hello!</h1>;
}
```

**Option 2: Arrow Function**
```javascript
const Welcome = () => {
  return <h1>Hello!</h1>;
};
```

**Option 3: Concise Arrow Function**
```javascript
const Welcome = () => <h1>Hello!</h1>;
```

### Component Structure

**File: src/components/Button.jsx**
```javascript
function Button() {
  return (
    <button className="btn">
      Click Me
    </button>
  );
}

export default Button;
```

**Using the component:**
```javascript
import Button from './components/Button';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <Button />
      <Button />
      <Button />
    </div>
  );
}
```

## 🎯 Practice Tasks

### Task 1: Create a Greeting Component
Create a component that displays a greeting message.

### Task 2: Create a Card Component
Build a card component with an image, title, and description.

### Task 3: Create a Button Component
Make a reusable button component with custom styling.

### Task 4: Component Composition
Create a ProfileCard that uses multiple smaller components (Avatar, Name, Bio).

## 📁 Recommended Folder Structure
```
src/
├── components/
│   ├── Greeting.jsx
│   ├── Card.jsx
│   ├── Button.jsx
│   └── ProfileCard.jsx
├── App.jsx
├── App.css
└── main.jsx
```

## 💻 Example: Complete Components

### Greeting Component
```javascript
// src/components/Greeting.jsx
function Greeting() {
  const name = "Alice";
  const time = "morning";
  
  return (
    <div className="greeting">
      <h1>Good {time}, {name}!</h1>
      <p>Welcome to React Components!</p>
    </div>
  );
}

export default Greeting;
```

### Card Component
```javascript
// src/components/Card.jsx
function Card() {
  return (
    <div className="card">
      <img src="https://via.placeholder.com/150" alt="Placeholder" />
      <h3>Card Title</h3>
      <p>This is a reusable card component!</p>
    </div>
  );
}

export default Card;
```

### Using Components in App
```javascript
// src/App.jsx
import Greeting from './components/Greeting';
import Card from './components/Card';
import './App.css';

function App() {
  return (
    <div className="App">
      <Greeting />
      <div className="card-container">
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}

export default App;
```

## 🎨 Styling Components

### Option 1: CSS Classes
```css
/* App.css */
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

### Option 2: Inline Styles
```javascript
function Card() {
  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px'
  };
  
  return <div style={cardStyle}>Card Content</div>;
}
```

## 🧩 Checkpoint Quiz

1. **What is a React component?**
   - [ ] A JavaScript function
   - [ ] A piece of HTML
   - [x] A reusable piece of UI
   - [ ] A CSS class

2. **How do you use a component in React?**
   - [ ] `<component />`
   - [x] `<Component />`
   - [ ] `{Component}`
   - [ ] `Component()`

3. **What keyword exports a component?**
   - [ ] send
   - [x] export
   - [ ] return
   - [ ] output

4. **What keyword imports a component?**
   - [x] import
   - [ ] require
   - [ ] include
   - [ ] get

## 🚀 Next Steps
Once you can create and use components, move on to:
**Iteration 7: Props & State** → Pass data and manage state

---

💡 **Tip**: Keep components small and focused on one thing!
