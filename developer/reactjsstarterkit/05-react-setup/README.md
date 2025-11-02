# ⚛️ Iteration 5: React Setup

## 🎯 Goal
Set up your first React application and understand the basics of how React works.

## 📚 What You'll Learn
- What is React and why use it
- Setting up a React project with Vite
- Understanding the project structure
- JSX basics
- Creating your first React component
- Running a development server

## 🔧 Prerequisites
- Node.js installed (v16 or higher)
- Basic JavaScript knowledge (completed iterations 0-4)
- Terminal/command line familiarity

## 🚀 Setup Instructions

### Step 1: Create React App with Vite
```bash
# Navigate to this iteration folder
cd 05-react-setup

# Create a new React project
npm create vite@latest my-first-react-app -- --template react

# Navigate into the project
cd my-first-react-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Step 2: Open in Browser
After running `npm run dev`, you'll see:
```
Local:   http://localhost:5173/
```
Open this URL in your browser!

## 📁 Project Structure
```
my-first-react-app/
├── node_modules/          # Dependencies (auto-generated)
├── public/                # Static files
├── src/                   # Your source code
│   ├── App.jsx           # Main App component
│   ├── App.css           # App styles
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Project configuration
└── vite.config.js        # Vite configuration
```

## 🧩 Understanding the Key Files

### `main.jsx` - Entry Point
This is where React starts:
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### `App.jsx` - Main Component
Your main React component:
```javascript
function App() {
  return (
    <div className="App">
      <h1>Hello React!</h1>
    </div>
  )
}

export default App
```

## 🎯 Your First Tasks

### Task 1: Modify the Welcome Message
1. Open `src/App.jsx`
2. Change the welcome message
3. Save and see live reload!

### Task 2: Add Your Name
Display a personalized greeting with your name

### Task 3: Add Multiple Elements
Practice creating a component with multiple HTML elements

## 📝 JSX Rules

1. **Return a single parent element:**
```javascript
// ✅ Good
return (
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
)

// ❌ Bad (multiple parents)
return (
  <h1>Title</h1>
  <p>Content</p>
)
```

2. **Use className instead of class:**
```javascript
<div className="container">...</div>
```

3. **Close all tags:**
```javascript
<img src="..." />
<input type="text" />
```

4. **Use { } for JavaScript expressions:**
```javascript
const name = "John";
return <h1>Hello, {name}!</h1>
```

## ✅ Success Checklist
- [ ] Created React app with Vite
- [ ] Installed dependencies
- [ ] Started development server
- [ ] Saw "Hello React" in browser
- [ ] Modified App.jsx and saw changes
- [ ] Understand basic JSX syntax

## 🧩 Checkpoint Quiz

1. **What is JSX?**
   - [ ] A new programming language
   - [x] JavaScript XML - HTML-like syntax for React
   - [ ] A CSS framework
   - [ ] A database

2. **What command starts the development server?**
   - [ ] npm start
   - [x] npm run dev
   - [ ] node app.js
   - [ ] npm build

3. **What's the entry point file in React?**
   - [ ] App.jsx
   - [x] main.jsx
   - [ ] index.html
   - [ ] package.json

4. **In JSX, what's the correct way to add a CSS class?**
   - [ ] class="myClass"
   - [x] className="myClass"
   - [ ] cssClass="myClass"
   - [ ] style="myClass"

## 🚀 Next Steps
Once you can create and modify a basic React app, move on to:
**Iteration 6: React Components** → Build reusable UI components

---

💡 **Tip**: Keep the dev server running! It auto-reloads when you save files.
