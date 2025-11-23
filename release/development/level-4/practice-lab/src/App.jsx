import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Welcome to Level 4!");

  return (
    <div className="container">
      <h1>🧪 Level 4 Practice Lab</h1>
      <p className="subtitle">
        Production-Ready Real-Time Application - Practice your advanced React
        skills!
      </p>

      <div className="example-box">
        <h2>Example: Basic State</h2>
        <p className="message">{message}</p>
        <button onClick={() => setMessage("Level 4 is awesome! 🚀")}>
          Update Message
        </button>
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
          <li>Copy the code and paste it here</li>
          <li>Save and watch it update automatically!</li>
        </ol>

        <h3>📚 Lessons Available</h3>
        <ul>
          <li>Lesson 1 - Understanding UI Libraries & Architecture (45 min)</li>
          <li>Lesson 2 - Advanced Authentication Flow (60 min)</li>
          <li>Lesson 3 - Ably Real-Time Client (75 min)</li>
          <li>Lesson 4 - Ably Server Integration (90 min)</li>
          <li>Lesson 5 - Advanced React Patterns (90 min)</li>
          <li>Lesson 6 - Production Features (90 min)</li>
        </ul>

        <h3>🎯 Practice Exercises</h3>
        <p>
          Complete the exercises in the <code>practice-lab/README.md</code>{" "}
          file:
        </p>
        <ul>
          <li>✅ Exercise 1: Explore architecture patterns</li>
          <li>✅ Exercise 2: Implement advanced auth flow</li>
          <li>✅ Exercise 3: Add Ably real-time features</li>
          <li>✅ Exercise 4: Configure server broadcasting</li>
          <li>✅ Exercise 5: Build custom hooks library</li>
          <li>✅ Exercise 6: Add production optimizations</li>
        </ul>

        <p className="tip">
          <strong>💡 Tip:</strong> Start with Lesson 1 to understand the
          architecture, then work through the lessons sequentially!
        </p>

        <div className="tech-stack">
          <h3>🛠️ Tech Stack</h3>
          <ul>
            <li>React 19 with Hooks</li>
            <li>Vite for fast development</li>
            <li>Ably for real-time features</li>
            <li>Custom CSS (no UI library)</li>
            <li>Service layer architecture</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
