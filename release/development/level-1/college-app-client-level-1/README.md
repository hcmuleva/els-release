# 🎓 College Member Directory - Level 1

## Overview

A clean and simple College Member Directory application built with React. This app demonstrates fundamental React concepts including components, props, array methods, and data management.

---

## ✨ Features

- 📊 **Statistics Dashboard** - Shows total members, students, faculty, and alumni
- 👥 **User Cards** - Displays member information with avatar initials
- 🎨 **Beautiful UI** - Gradient design with smooth animations
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- 🧩 **Component-Based** - Clean, reusable component architecture

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Open in Browser

Navigate to `http://localhost:5173`

---

## 📂 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # App title and description
│   ├── StatCard.jsx        # Statistics display card
│   └── UserCard.jsx        # Individual user profile card
├── data/
│   └── users.js            # User data array
├── styles/
│   ├── App.css             # Main app and layout styles
│   └── UserCard.css        # User card specific styles
├── App.jsx                 # Main application component
├── main.jsx                # React DOM entry point
└── index.css               # Global styles
```

---

## 🧩 Components Breakdown

### **Header Component**

- Displays app title and description
- Static component (no props needed)

```jsx
<Header />
```

### **StatCard Component**

- Shows a number and label
- Receives `number` and `label` props

```jsx
<StatCard number={8} label="Total Members" />
```

### **UserCard Component**

- Displays user profile information
- Receives user data via props: `firstName`, `lastName`, `role`, `age`, `program`, `year`
- Auto-generates avatar initials
- Color-coded role badges

```jsx
<UserCard
  firstName="Alice"
  lastName="Johnson"
  role="student"
  age={20}
  program="Computer Science"
  year="3rd Year"
/>
```

---

## 📊 Data Structure

Users are stored in `src/data/users.js`:

```javascript
{
  id: 1,
  firstName: "Alice",
  lastName: "Johnson",
  role: "student",      // "student" | "faculty" | "alumni"
  age: 20,
  program: "Computer Science",
  year: "3rd Year"
}
```

---

## 🎨 Styling

### Color Scheme

- **Primary Gradient:** `#667eea` → `#764ba2`
- **Student Badge:** Blue (`#1976d2`)
- **Faculty Badge:** Green (`#388e3c`)
- **Alumni Badge:** Purple (`#7b1fa2`)

### Responsive Breakpoints

- **Mobile:** < 768px
- **Desktop:** ≥ 768px

---

## 🔧 Key React Concepts Used

### 1. **Components**

Breaking UI into reusable pieces:

```jsx
function Header() {
  return <header>...</header>;
}
```

### 2. **Props**

Passing data to components:

```jsx
<StatCard number={8} label="Total Members" />
```

### 3. **Array Methods**

**`.filter()`** - Calculate statistics:

```jsx
const totalStudents = users.filter((user) => user.role === "student").length;
```

**`.map()`** - Render user cards:

```jsx
{
  users.map((user) => <UserCard key={user.id} {...user} />);
}
```

### 4. **Import/Export**

Organizing code across files:

```jsx
// Export
export default UserCard;

// Import
import UserCard from "./components/UserCard";
```

---

## 🎯 Learning Goals

This application teaches:

✅ **Component creation** - Building reusable UI pieces  
✅ **Props usage** - Passing data between components  
✅ **Array methods** - `.map()` and `.filter()`  
✅ **Data management** - Separating data from UI  
✅ **File organization** - Proper folder structure  
✅ **CSS styling** - Component-specific styles

---

## 🔨 Customization Ideas

### Add New Users

Edit `src/data/users.js`:

```javascript
{
  id: 9,
  firstName: "Your",
  lastName: "Name",
  role: "student",
  age: 20,
  program: "Your Program",
  year: "Your Year"
}
```

### Create New Components

1. Create file in `src/components/`
2. Export the component
3. Import in `App.jsx`

### Modify Styles

Edit CSS files in `src/styles/`

---

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
npm run dev -- --port 5174
```

### Changes Not Showing

- Save your files
- Hard refresh browser: `Ctrl + Shift + R`
- Check console for errors (F12)

### Import Errors

- Verify file paths (case-sensitive!)
- Ensure `export default` exists
- Restart dev server

---

## 🎓 What's Next?

After mastering Level 1, move to **Level 2** to learn:

- React Hooks (`useState`, `useEffect`)
- Interactive features
- Form handling
- Dynamic state management

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [MDN Web Docs](https://developer.mozilla.org)

---

**Built with ❤️ for learning React fundamentals**
