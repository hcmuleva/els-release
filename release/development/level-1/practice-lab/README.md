# Level 1 Practice Lab# 🧪 Practice Lab

## 🎯 Overview## What is This?

This practice lab is your **experimental workspace** for **Level 1**. Here you can safely test all Vanilla JS concepts and React basics without breaking anything!This is your **experimental workspace** where you can safely test all the code snippets from the lessons. Think of it as a sandbox - you can break things, try new ideas, and learn by doing!

---## 🚀 How to Use

## 📚 Prerequisites### Step 1: Install Dependencies

- ✅ Basic HTML knowledgeOpen terminal in this folder and run:

- ✅ Basic CSS knowledge

- ✅ JavaScript fundamentals (variables, functions, arrays)```bash

npm install

---```

## 🛠️ Setup### Step 2: Start the Development Server

### 1. Install Dependencies```bash

npm run dev

`bash`

cd practice-lab

npm installYour browser will open at `http://localhost:5173`

````

### Step 3: Experiment!

### 2. Run Development Server

1. Open a lesson file (e.g., `lessons/lesson-1.1-react-basics.md`)

```bash2. Find a code snippet you want to try

npm run dev3. Copy it

```4. Open `src/App.jsx` in this folder

5. Paste the code between the comment markers:

Visit: http://localhost:5173

   ```jsx

---   {

     /* 👇 Paste your code below this line */

## 🎓 Lab Exercises   }



### Exercise 1: React Basics   // YOUR CODE HERE

**Goal**: Understand JSX and component structure

   {

**Tasks**:     /* 👆 Paste your code above this line */

1. ✅ Create a greeting component   }

2. ✅ Use curly braces `{}` for JavaScript expressions   ```

3. ✅ Display variables in JSX

4. ✅ Use className instead of class6. Save the file and see the result instantly in your browser!

5. ✅ Practice self-closing tags

## 📝 Tips

**Example**:

```jsx- **Don't worry about breaking things** - you can always reset `App.jsx` to the starter code

function App() {- **Try modifying the examples** - change colors, text, add more items

  const name = "Alice";- **Experiment freely** - the best way to learn is by trying!

  const age = 20;- **Check the browser console** - Press F12 to see errors and logs



  return (## 🔄 Reset to Default

    <div className="container">

      <h1>Hello, {name}!</h1>If you want to start fresh, replace `src/App.jsx` with:

      <p>You are {age} years old.</p>

    </div>```jsx

  );function App() {

}  return (

```    <div className="container">

      <h1>🧪 Practice Lab</h1>

---      <p>Copy and paste code from lessons here to experiment!</p>



### Exercise 2: Lists and Arrays      {/* 👇 Paste your code below this line */}

**Goal**: Render arrays using `.map()`

      {/* 👆 Paste your code above this line */}

**Tasks**:    </div>

1. ✅ Create an array of students  );

2. ✅ Use `.map()` to render list items}

3. ✅ Add unique `key` prop to each item

4. ✅ Style the list with CSSexport default App;

5. ✅ Display object properties```



**Example**:## 🎨 Styling

```jsx

function App() {The practice lab comes with pre-styled CSS in `src/index.css`. You get:

  const students = [

    { id: 1, name: "Alice", major: "CS" },- Beautiful gradient background

    { id: 2, name: "Bob", major: "Engineering" },- Styled buttons, lists, and headings

    { id: 3, name: "Charlie", major: "Math" }- Responsive layout

  ];- Clean card design



  return (Focus on learning React - the styling is already done for you!

    <div className="container">

      <h1>Student List</h1>---

      <ul>

        {students.map(student => (**Happy Experimenting! 🚀**

          <li key={student.id}>
            {student.name} - {student.major}
          </li>
        ))}
      </ul>
    </div>
  );
}
````

---

### Exercise 3: Props Basics

**Goal**: Pass data between components using props

**Tasks**:

1. ✅ Create a reusable Card component
2. ✅ Pass props (title, description)
3. ✅ Use destructuring in props
4. ✅ Set default prop values
5. ✅ Reuse component multiple times

**Example**:

```jsx
function Card({ title, description }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function App() {
  return (
    <div className="container">
      <Card title="React" description="A JavaScript library" />
      <Card title="Vite" description="Fast build tool" />
    </div>
  );
}
```

---

### Exercise 4: Conditional Rendering

**Goal**: Show/hide elements based on conditions

**Tasks**:

1. ✅ Use ternary operator for conditions
2. ✅ Use `&&` for simple conditionals
3. ✅ Render different content based on variables
4. ✅ Handle null/undefined cases
5. ✅ Show loading states

**Example**:

```jsx
function App() {
  const isLoggedIn = true;
  const user = { name: "Alice", role: "STUDENT" };

  return (
    <div className="container">
      <h1>College App</h1>
      {isLoggedIn ? <p>Welcome, {user.name}!</p> : <p>Please log in</p>}

      {user.role === "ADMIN" && <button>Admin Panel</button>}
    </div>
  );
}
```

---

### Exercise 5: Event Handlers

**Goal**: Handle user interactions (without state for now)

**Tasks**:

1. ✅ Add onClick handlers
2. ✅ Use console.log to verify clicks
3. ✅ Pass arguments to handlers
4. ✅ Prevent default behavior
5. ✅ Handle form submissions

**Example**:

```jsx
function App() {
  const handleClick = () => {
    console.log("Button clicked!");
    alert("Hello from React!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="container">
      <button onClick={handleClick}>Click Me</button>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Your name" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
```

---

## 📖 How to Use This Lab

### Method 1: Copy from Lessons

1. Open a lesson from `lessons/` folder
2. Find code marked with **🔬 Try in Practice Lab**
3. Copy the entire code snippet
4. Open `src/App.jsx`
5. Replace the content with your code
6. Save and watch the browser update!

### Method 2: Experiment Freely

1. Open `src/App.jsx`
2. Write your own code between the comment markers:

   ```jsx
   {
     /* 👇 Paste your code below this line */
   }

   {
     /* 👆 Paste your code above this line */
   }
   ```

3. Save and see results instantly

---

## 🔄 Reset to Default

If you break something, reset `src/App.jsx`:

```jsx
function App() {
  return (
    <div className="container">
      <h1>Welcome to React</h1>
      <h2>Learning JSX</h2>
      <p>This is a paragraph with some text.</p>
      <p>React makes building websites fun and easy!</p>
      {/* 👇 Paste your code below this line */}

      {/* 👆 Paste your code above this line */}
    </div>
  );
}

export default App;
```

---

## 🧪 Testing Checklist

- [ ] JSX syntax renders correctly
- [ ] Variables display inside `{}`
- [ ] Arrays render using `.map()`
- [ ] Props work between components
- [ ] Conditional rendering shows/hides content
- [ ] Event handlers trigger on click
- [ ] Console shows no errors (F12)

---

## 🚀 Bonus Challenges

### Challenge 1: Member Directory

Create a list of college members with name, role, and photo placeholder.

### Challenge 2: Color Palette

Display a grid of color boxes with names using array mapping.

### Challenge 3: Button Counter (No State)

Create multiple buttons that log different messages when clicked.

### Challenge 4: Card Gallery

Build a gallery of feature cards using reusable components.

### Challenge 5: Conditional Badges

Show different badge colors based on member role (STUDENT/ALUMNI/ADMIN).

---

## 📚 Key Concepts

### JSX Rules

- Use `className` instead of `class`
- Close all tags: `<img />`, `<br />`
- Use camelCase: `onClick`, `backgroundColor`
- Expressions in `{}`: `{variable}`, `{2 + 2}`

### Array Rendering

```jsx
{
  items.map((item) => <li key={item.id}>{item.name}</li>);
}
```

### Props

```jsx
function Card({ title, children }) {
  return (
    <div>
      {title} - {children}
    </div>
  );
}
```

### Conditionals

```jsx
{
  condition ? <Yes /> : <No />;
}
{
  condition && <OnlyIfTrue />;
}
```

---

## 💡 Tips

- **Use Browser DevTools**: Press F12 to see console and errors
- **Read Error Messages**: They tell you exactly what's wrong
- **Experiment Freely**: You can't break anything permanently
- **Check Formatting**: VSCode auto-formats on save
- **Ask Questions**: No question is too small!

---

## 📂 Project Structure

```
practice-lab/
├── src/
│   ├── App.jsx        # Your experimental code goes here
│   ├── index.css      # Pre-styled CSS (dark theme)
│   └── main.jsx       # Entry point (don't modify)
├── index.html
├── package.json
└── README.md (this file)
```

---

## 🎨 Pre-Styled Elements

The lab includes CSS for:

- `.container` - Main wrapper with max-width
- `h1, h2, h3` - Gradient headings
- `button` - Styled buttons with hover effects
- `ul, li` - Clean lists
- `.card` - Card components with borders
- Forms and inputs - Clean form styling

**Focus on React, not CSS!** The styling is done for you.

---

## 🆘 Troubleshooting

### Nothing shows on screen

- Check browser console for errors
- Make sure you're returning JSX from `App()`
- Check all tags are properly closed

### "key" prop warning

- Add unique `key` prop when using `.map()`
- Example: `key={item.id}`

### Module not found

- Run `npm install` in practice-lab directory
- Restart dev server with `npm run dev`

---

**Happy Learning!** 🚀 Master React basics before moving to Level 2!
