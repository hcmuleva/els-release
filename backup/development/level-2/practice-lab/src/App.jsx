import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h1>🧪 Level 2 Practice Lab</h1>
      <p className="subtitle">
        Welcome to your React Hooks sandbox! Follow the lessons and paste
        examples here.
      </p>

      <div className="example-box">
        <h2>Example: Counter</h2>
        <p className="count">Count: {count}</p>
        <div className="button-group">
          <button onClick={() => setCount(count + 1)}>Increment</button>
          <button onClick={() => setCount(count - 1)}>Decrement</button>
          <button onClick={() => setCount(0)}>Reset</button>
        </div>
      </div>

      <div className="instructions">
        <h3>📖 How to Use This Lab</h3>
        <ol>
          <li>
            Open a lesson from <code>lessons/</code> folder
          </li>
          <li>
            Find code marked with <strong>🔬 Try in Practice Lab</strong>
          </li>
          <li>Copy the code and replace the content in this file</li>
          <li>Save and watch it update automatically!</li>
        </ol>

        <h3>📚 Lessons Available</h3>
        <ul>
          <li>Lesson 2.1 - Introduction to Hooks</li>
          <li>Lesson 2.2 - useState Hook</li>
          <li>Lesson 2.3 - useEffect Hook</li>
          <li>Lesson 2.4 - Building Forms with Hooks</li>
        </ul>

        <p className="tip">
          <strong>💡 Tip:</strong> Start with Lesson 2.1 and work your way
          through!
        </p>
      </div>
    </div>
  );
}

export default App;
