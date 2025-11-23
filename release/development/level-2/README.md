# 🎓 Level 2 - React Hooks, Routing & Interactive UI

Master React Hooks, multi-page navigation, and build an interactive College Member Directory with authentication pages.Master React Hooks, multi-page navigation, and build an interactive College Member Directory with authentication pages.

## 🎯 What You'll Learn## 🎯 What You'll Learn

✅ **React Hooks** - useState, useEffect for state management ✅ **React Hooks** - useState, useEffect for state management

✅ **React Router** - Multi-page navigation with routing ✅ **React Router** - Multi-page navigation with routing

✅ **Interactive Features** - Search, filters, dynamic data ✅ **Interactive Features** - Search, filters, dynamic data

✅ **Form Handling** - Login/Register forms with validation ✅ **Form Handling** - Login/Register forms with validation

✅ **Event Handling** - onClick, onChange, onSubmit ✅ **Event Handling** - onClick, onChange, onSubmit

✅ **Conditional Rendering** - Show/hide based on state ✅ **Conditional Rendering** - Show/hide based on state

---

## 📋 What You'll Build## 📋 What You'll Build

A **multi-page interactive member directory** with authentication pages, search, and filters.A **multi-page interactive member directory** with authentication pages, search, and filters.

**New in Level 2:\*\***New in Level 2:\*\*

- 🔥 **useState & useEffect** - State management and side effects- 🔥 **useState & useEffect** - State management and side effects

- 🔥 **React Router** - Multi-page app (Home, Login, Register)- 🔥 **React Router** - Multi-page app (Home, Members, Login, Register)

- 🔥 **Working Search** - Filter members by name in real-time- 🔥 **Working Search** - Filter members by name in real-time

- 🔥 **Working Filters** - Filter by role (Student/Alumni/Admin)- 🔥 **Working Filters** - Filter by role (Student/Alumni/Admin)

- 🔥 **Login/Register Pages** - Complete forms with validation- 🔥 **Login/Register Pages** - Complete forms with validation

- 🔥 **Navigation** - Navigate between pages with routing- 🔥 **Protected Routes** - Navigate between pages

**Key Difference from Level 1:\*\***Key Difference from Level 1:\*\*

- **Level 1**: Single page, static components with props- **Level 1**: Single page, static components with props

- **Level 2**: Multi-page app with routing, interactive state, and working features- **Level 2**: Multi-page app with routing, interactive state, and working features

---

## 📂 Folder Structure## � Folder Structure

````

level-2/level-2/

├── README.md                          # ⬅️ You are here├── README.md                          # ⬅️ You are here

├── college-app-client-level-2/        # Working application├── college-app-client-level-2/        # Working application

│   ├── src/│   ├── src/

│   │   ├── components/                # Reusable components│   │   ├── components/                # Interactive components

│   │   │   ├── Header.jsx             # Navigation header│   │   │   ├── Header.jsx

│   │   │   ├── UserCard.jsx           # User display card│   │   │   ├── UserCard.jsx

│   │   │   ├── SearchBar.jsx          # Search with state│   │   │   ├── UserForm.jsx           # NEW: Form with hooks

│   │   │   ├── FilterButtons.jsx      # Filters with state│   │   │   ├── SearchBar.jsx          # NEW: Search with state

│   │   │   └── Layout.jsx             # Page layout wrapper│   │   │   └── FilterButtons.jsx      # NEW: Filter with state

│   │   ├── pages/                     # NEW: Page components│   │   ├── data/

│   │   │   ├── Home.jsx               # Home/Members list page│   │   │   └── users.js

│   │   │   ├── Login.jsx              # Login form page│   │   ├── styles/

│   │   │   └── Register.jsx           # Registration form page│   │   │   ├── App.css

│   │   ├── data/│   │   │   ├── UserCard.css

│   │   │   └── users.js               # User data│   │   │   └── UserForm.css           # NEW

│   │   ├── styles/│   │   ├── App.jsx                    # Now with state!

│   │   │   ├── App.css│   │   ├── main.jsx

│   │   │   ├── Home.css│   │   └── index.css

│   │   │   ├── Login.css│   ├── package.json

│   │   │   └── Register.css│   └── vite.config.js

│   │   ├── App.jsx                    # Router setup├── lessons/                           # Step-by-step tutorials

│   │   ├── main.jsx                   # Entry point│   ├── lesson-2.1-intro-hooks.md      # What are hooks?

│   │   └── index.css                  # Global styles│   ├── lesson-2.2-usestate.md         # State management

│   ├── package.json│   ├── lesson-2.3-useeffect.md        # Side effects

│   └── vite.config.js│   └── lesson-2.4-forms-hooks.md      # Building forms

├── lessons/                           # Step-by-step tutorials└── practice-lab/                      # Experimental workspace

│   ├── lesson-2.1-intro-hooks.md      # Hooks introduction    ├── src/

│   ├── lesson-2.2-usestate.md         # State management    │   └── App.jsx                    # Your sandbox

│   ├── lesson-2.3-useeffect.md        # Side effects    ├── package.json

│   ├── lesson-2.4-routing.md          # NEW: React Router    └── README.md

│   └── lesson-2.5-forms-hooks.md      # Building forms```

└── practice-lab/                      # Experimental workspace

    ├── src/---

    │   └── App.jsx                    # Your sandbox

    ├── package.json## 📖 Lessons (~4 hours total)

    └── README.md

```| Lesson  | Topic                           | Time   | What You'll Build                |

| ------- | ------------------------------- | ------ | -------------------------------- |

---| **2.1** | Introduction to Hooks           | 45 min | Toggle buttons, visibility logic |

| **2.2** | useState Hook                   | 60 min | Counter, input fields, toggles   |

## 📖 Lessons (~5.5 hours total)| **2.3** | useEffect Hook                  | 60 min | Timer, data fetching, cleanup    |

| **2.4** | Building Forms with Hooks       | 75 min | User registration form           |

| Lesson  | Topic                           | Time   | What You'll Build                     |

| ------- | ------------------------------- | ------ | ------------------------------------- |📁 All lessons in `lessons/` folder

| **2.1** | Introduction to Hooks           | 45 min | Toggle buttons, visibility logic      |

| **2.2** | useState Hook                   | 60 min | Counter, input fields, search filter  |---

| **2.3** | useEffect Hook                  | 60 min | Timer, data fetching, title updates   |

| **2.4** | React Router & Navigation       | 75 min | Multi-page app with routes            |## � Quick Start

| **2.5** | Forms with Hooks                | 75 min | Login/Register forms with validation  |

### 1. Practice Lab (Learn Here First)

📁 All lessons in `lessons/` folder

```bash

---cd practice-lab

npm install

## 🚀 Quick Startnpm run dev

```

### 1. Practice Lab (Learn Here First)

Open `http://localhost:5173` → Follow lessons → Copy code → Experiment!

```bash

cd practice-lab### 2. Working App (Final Reference)

npm install

npm run dev```bash

```cd college-app-client-level-2

npm install

Open `http://localhost:5173` → Follow lessons → Copy code → Experiment!npm run dev

```

### 2. Working App (Final Reference)

See the complete member directory with **working search and filters**!

```bash

cd college-app-client-level-2---

npm install

npm run dev## 🎯 Learning Path

```

### Coming from Level 1?

Navigate between pages:

- `/` - Home page with member directoryIn Level 1, you learned:

- `/login` - Login form- ✅ JSX basics, components, props

- `/register` - Registration form- ✅ Variables and array methods

- ✅ Static UI components

---

### What's New in Level 2?

## 🎯 Learning Path

Now you'll add **interactivity**:

### Coming from Level 1?- 🔥 **State** - Data that changes over time

- 🔥 **Hooks** - Special functions to use state and effects

In Level 1, you learned:- 🔥 **Forms** - Capture user input

- ✅ JSX basics, components, props- 🔥 **Filtering** - Show/hide data dynamically

- ✅ Variables and array methods

- ✅ Static UI components### What You'll Build:



### What's New in Level 2?**Level 1 App**: Static list of members

**Level 2 App**: Interactive directory with:

Now you'll add **interactivity and navigation**:- ✨ Search bar (filter by name)

- 🔥 **State** - Data that changes over time- ✨ Role filter buttons (Student/Alumni/Admin)

- 🔥 **Hooks** - Special functions to use state and effects- ✨ Add new member form

- 🔥 **Routing** - Multiple pages in a single-page app- ✨ Toggle view modes (grid/list)

- 🔥 **Forms** - Capture and validate user input

- 🔥 **Filtering** - Show/hide data dynamically---



### What You'll Build:## 🗺️ The 4-Level Journey



**Level 1 App**: Static single-page member list  | Level | Focus                     | App State                         |

**Level 2 App**: Multi-page interactive directory with:| ----- | ------------------------- | --------------------------------- |

- ✨ Home page with member directory| **1** | React Fundamentals        | Static components                 |

- ✨ Search bar (filter by name in real-time)| **2** | Hooks & Forms ⬅️ YOU ARE HERE | Interactive, client-side only     |

- ✨ Role filter buttons (Student/Alumni/Admin)| **3** | Routing & API Integration | Multi-page, real backend          |

- ✨ Login page with form validation| **4** | Auth & Real-time Features | Production app with authentication |

- ✨ Register page with multi-field form

- ✨ Navigation between pages---



---## 📚 Prerequisites



## 🗺️ The 4-Level JourneyBefore starting Level 2, you should understand:

- ✅ JSX syntax and basic elements

| Level | Focus                              | App State                                  |- ✅ JavaScript variables and functions

| ----- | ---------------------------------- | ------------------------------------------ |- ✅ Array methods (`.map()`, `.filter()`)

| **1** | React Fundamentals                 | Static single-page components              |- ✅ Components and props

| **2** | Hooks & Routing ⬅️ YOU ARE HERE    | Multi-page, interactive, client-side only  |

| **3** | API Integration                    | Real backend, data fetching, authentication|**Not confident?** Review [Level 1 lessons](../level-1/README.md) first!

| **4** | Real-time & Production             | WebSockets, live updates, deployment       |

---

---

## 🎓 After Completing Level 2

## 📚 Prerequisites

You'll be able to:

Before starting Level 2, you should understand:- ✅ Use `useState` to manage component state

- ✅ JSX syntax and basic elements- ✅ Use `useEffect` for side effects

- ✅ JavaScript variables and functions- ✅ Build controlled form components

- ✅ Array methods (`.map()`, `.filter()`)- ✅ Handle user input and events

- ✅ Components and props- ✅ Create interactive, dynamic UIs



**Not confident?** Review [Level 1 lessons](../level-1/README.md) first!**Next:** [Level 3 - Routing & API Integration](../level-3/README.md)



------



## 🎓 After Completing Level 2## � Tips for Success



You'll be able to:1. **Follow lessons in order** - Each builds on the previous

- ✅ Use `useState` to manage component state2. **Type the code yourself** - Don't just copy-paste

- ✅ Use `useEffect` for side effects3. **Experiment in Practice Lab** - Break things and learn

- ✅ Set up React Router for multi-page apps4. **Read error messages** - They help you learn

- ✅ Navigate between pages programmatically5. **Ask questions** - Understanding > memorization

- ✅ Build controlled form components

- ✅ Handle user input and events---

- ✅ Validate forms before submission

- ✅ Create interactive, dynamic UIs## 🆘 Need Help?



**Next:** [Level 3 - API Integration & Backend](../level-3/README.md)- 📖 Read the lesson markdown files carefully

- 🧪 Experiment in the Practice Lab

---- 👀 Check the working app for reference

- � Read React docs: [react.dev/reference/react](https://react.dev/reference/react)

## 💡 Tips for Success

---

1. **Follow lessons in order** - Each builds on the previous (especially 2.4 before 2.5!)

2. **Type the code yourself** - Don't just copy-paste**Ready to learn hooks?** Start with [Lesson 2.1 - Introduction to Hooks](lessons/lesson-2.1-intro-hooks.md)! 🚀

3. **Experiment in Practice Lab** - Break things and learn

4. **Read error messages** - They help you learn
5. **Test routing early** - Make sure navigation works before building forms

---

## 🆘 Need Help?

- 📖 Read the lesson markdown files carefully
- 🧪 Experiment in the Practice Lab
- 👀 Check the working app for reference
- 🔍 Read React Router docs: [reactrouter.com](https://reactrouter.com)
- 🔍 Read React docs: [react.dev/reference/react](https://react.dev/reference/react)

---

## 💻 What You'll Build

**College Member Directory with:**

- 🏠 **Home Page** - Member directory with search and filters
- 🔍 **Working Search** - Real-time filtering by name
- 🎯 **Role Filters** - Filter by Student/Alumni/Admin
- 📊 **Dynamic Stats** - Shows "X of Y members" based on filters
- 🔐 **Login Page** - Email/password form with validation
- 📝 **Register Page** - Multi-field form with all validations
- 🚀 **Navigation** - Click links to navigate between pages

---

**Ready to learn hooks and routing?** Start with [Lesson 2.1 - Introduction to Hooks](lessons/lesson-2.1-intro-hooks.md)! 🚀
````
