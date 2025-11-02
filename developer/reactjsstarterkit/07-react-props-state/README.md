# 🔄 Iteration 7: Props & State

## 🎯 Goal
Learn to pass data to components with props and manage component data with state.

## 📚 What You'll Learn
- What are props (properties)
- Passing data from parent to child
- Props validation
- What is state
- useState hook
- Updating state
- Managing component data

## 🔑 Key Concepts

### Props (Properties)

Props allow you to pass data to components, making them reusable and dynamic.

**Without props (static):**
```javascript
function Greeting() {
  return <h1>Hello, Alice!</h1>;
}
```

**With props (dynamic):**
```javascript
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Usage:
<Greeting name="Alice" />
<Greeting name="Bob" />
<Greeting name="Charlie" />
```

**Destructuring props:**
```javascript
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}
```

### State

State is data that **changes over time** in a component.

```javascript
import { useState } from 'react';

function Counter() {
  // Declare state variable
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(count + 1);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}
```

## 💻 Complete Examples

### Example 1: Greeting Card with Props
```javascript
// src/components/GreetingCard.jsx
function GreetingCard({ name, title, imageUrl }) {
  return (
    <div className="card">
      <img src={imageUrl} alt={name} />
      <h2>{name}</h2>
      <p>{title}</p>
    </div>
  );
}

export default GreetingCard;

// Usage in App.jsx
<GreetingCard 
  name="Alice" 
  title="Software Engineer"
  imageUrl="https://via.placeholder.com/100"
/>
```

### Example 2: Counter with State
```javascript
// src/components/Counter.jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);
  
  return (
    <div className="counter">
      <h2>Counter</h2>
      <p className="count-display">{count}</p>
      <div className="button-group">
        <button onClick={decrement}>−</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
}

export default Counter;
```

### Example 3: Text Input with State
```javascript
// src/components/TextInput.jsx
import { useState } from 'react';

function TextInput() {
  const [text, setText] = useState('');
  
  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />
      <p>You typed: {text}</p>
      <p>Length: {text.length} characters</p>
    </div>
  );
}

export default TextInput;
```

### Example 4: Toggle Switch
```javascript
// src/components/Toggle.jsx
import { useState } from 'react';

function Toggle() {
  const [isOn, setIsOn] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsOn(!isOn)}>
        {isOn ? 'ON ✅' : 'OFF ❌'}
      </button>
      <p>The switch is {isOn ? 'on' : 'off'}</p>
    </div>
  );
}

export default Toggle;
```

## 🎯 Practice Tasks

### Task 1: Profile Card with Props
Create a ProfileCard component that accepts:
- name
- age
- occupation
- location

### Task 2: Like Button
Create a button that tracks likes and shows the count.

### Task 3: Temperature Converter
Build a component that converts Celsius to Fahrenheit as you type.

### Task 4: Color Picker
Create buttons that change the background color using state.

## 📊 Props vs State

| Props | State |
|-------|-------|
| Read-only | Can be changed |
| Passed from parent | Internal to component |
| Like function parameters | Like function variables |
| `{props.name}` | `const [name, setName] = useState()` |

## 🧩 Checkpoint Quiz

1. **What are props used for?**
   - [ ] Styling components
   - [x] Passing data to components
   - [ ] Creating loops
   - [ ] Managing state

2. **Can you modify props inside a component?**
   - [ ] Yes, always
   - [x] No, props are read-only
   - [ ] Only with setState
   - [ ] Only in class components

3. **What hook is used for state in functional components?**
   - [ ] useEffect
   - [x] useState
   - [ ] useProps
   - [ ] useData

4. **How do you update state?**
   - [ ] state = newValue
   - [ ] setState(newValue)
   - [x] Use the setter function from useState
   - [ ] Update directly

## 🎨 Complete App Example

```javascript
// src/App.jsx
import { useState } from 'react';
import GreetingCard from './components/GreetingCard';
import Counter from './components/Counter';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <div className={`App ${theme}`}>
      <button onClick={toggleTheme}>
        Toggle Theme ({theme})
      </button>
      
      <h1>React Props & State</h1>
      
      <div className="cards">
        <GreetingCard 
          name="Alice"
          title="Developer"
          imageUrl="https://via.placeholder.com/100/0000FF"
        />
        <GreetingCard 
          name="Bob"
          title="Designer"
          imageUrl="https://via.placeholder.com/100/FF0000"
        />
      </div>
      
      <Counter />
    </div>
  );
}

export default App;
```

## 🚀 Next Steps
Once you master props and state, move on to:
**Iteration 8: Events & Lists** → Handle user interactions and render dynamic lists

---

💡 **Tip**: State changes trigger re-renders. Use state for data that changes!
