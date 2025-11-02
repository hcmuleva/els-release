# 🧠 Iteration 8: Events & Lists

## 🎯 Goal
Handle user events and render dynamic lists of data in React.

## 📚 What You'll Learn
- Handling click events
- Handling input events
- Handling form submissions
- Rendering lists with `.map()`
- Using keys in lists
- Adding and removing list items
- Building a Todo List application

## 🎪 Event Handling

### Click Events
```javascript
function Button() {
  const handleClick = () => {
    alert('Button clicked!');
  };
  
  return <button onClick={handleClick}>Click Me</button>;
}
```

### Inline Event Handlers
```javascript
<button onClick={() => alert('Clicked!')}>
  Click Me
</button>
```

### Event with Parameters
```javascript
function Button() {
  const handleClick = (name) => {
    alert(`Hello, ${name}!`);
  };
  
  return <button onClick={() => handleClick('Alice')}>Say Hello</button>;
}
```

### Input Events
```javascript
import { useState } from 'react';

function TextInput() {
  const [value, setValue] = useState('');
  
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

## 📋 Rendering Lists

### Basic List Rendering
```javascript
function FruitList() {
  const fruits = ['Apple', 'Banana', 'Orange'];
  
  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}
```

### List of Objects
```javascript
function UserList() {
  const users = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 }
  ];
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p>Age: {user.age}</p>
        </div>
      ))}
    </div>
  );
}
```

## 💻 Complete Example: Todo List

```javascript
// src/components/TodoList.jsx
import { useState } from 'react';
import './TodoList.css';

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  
  // Add new todo
  const addTodo = () => {
    if (inputValue.trim() === '') return;
    
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };
    
    setTodos([...todos, newTodo]);
    setInputValue('');
  };
  
  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  // Toggle completed
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };
  
  return (
    <div className="todo-container">
      <h1>📝 My Todo List</h1>
      
      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      
      <div className="stats">
        <p>Total: {todos.length} | Completed: {todos.filter(t => t.completed).length}</p>
      </div>
      
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span onClick={() => toggleTodo(todo.id)}>
              {todo.text}
            </span>
            <button 
              className="delete-btn"
              onClick={() => deleteTodo(todo.id)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
      
      {todos.length === 0 && (
        <p className="empty-message">No todos yet! Add one above.</p>
      )}
    </div>
  );
}

export default TodoList;
```

### Styling (TodoList.css)
```css
.todo-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.input-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input-section input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.input-section button {
  padding: 12px 24px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.input-section button:hover {
  background: #45a049;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  margin: 8px 0;
  background: #f9f9f9;
  border-radius: 5px;
  transition: all 0.3s;
}

.todo-list li:hover {
  background: #f0f0f0;
}

.todo-list li.completed span {
  text-decoration: line-through;
  opacity: 0.6;
}

.todo-list li span {
  flex: 1;
  cursor: pointer;
}

.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

.stats {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.empty-message {
  text-align: center;
  color: #999;
  padding: 40px;
}
```

## 🎯 Practice Tasks

### Task 1: Simple List
Create a component that displays a list of your favorite movies.

### Task 2: Color Buttons
Create buttons that change background color, store colors in an array.

### Task 3: Shopping List
Build a shopping list where you can add and remove items.

### Task 4: User Directory
Display a list of users with name, email, and a delete button.

## 🧩 Checkpoint Quiz

1. **How do you handle a click event in React?**
   - [ ] `onclick="handleClick"`
   - [x] `onClick={handleClick}`
   - [ ] `onClick="handleClick()"`
   - [ ] `click={handleClick}`

2. **What method renders a list in React?**
   - [ ] forEach
   - [x] map
   - [ ] filter
   - [ ] reduce

3. **Why do list items need a key prop?**
   - [ ] For styling
   - [x] To help React identify which items changed
   - [ ] To sort the list
   - [ ] It's optional

4. **How do you add an item to a state array?**
   - [ ] `array.push(item)`
   - [x] `setArray([...array, item])`
   - [ ] `array = [...array, item]`
   - [ ] `setArray(array.push(item))`

## 🚀 Next Steps
Once you master events and lists, move on to:
**Iteration 9: Fetch API** → Get data from servers

---

💡 **Tip**: Always use unique IDs as keys, not array indexes!
