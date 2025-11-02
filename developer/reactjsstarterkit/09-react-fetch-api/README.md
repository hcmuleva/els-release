# 🌐 Iteration 9: Fetch API

## 🎯 Goal
Learn to fetch data from APIs and handle asynchronous operations in React.

## 📚 What You'll Learn
- What are APIs and REST
- Using the Fetch API
- Async/await in React
- useEffect hook
- Loading states
- Error handling
- Displaying fetched data

## 🔑 Key Concepts

### What is an API?
An **API** (Application Programming Interface) lets your app get data from a server.

### The Fetch API
JavaScript's built-in way to make HTTP requests:

```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Using Async/Await (Modern Way)
```javascript
async function getData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  console.log(data);
}
```

## 🪝 useEffect Hook

The `useEffect` hook runs code after component renders - perfect for fetching data!

```javascript
import { useEffect } from 'react';

useEffect(() => {
  // Code here runs after component renders
  console.log('Component mounted!');
}, []); // Empty array = run once on mount
```

## 💻 Complete Example: User List from API

```javascript
// src/components/UserList.jsx
import { useState, useEffect } from 'react';
import './UserList.css';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch users from JSONPlaceholder (free API)
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []); // Run once on component mount
  
  if (loading) {
    return <div className="loading">Loading users... ⏳</div>;
  }
  
  if (error) {
    return <div className="error">Error: {error} ❌</div>;
  }
  
  return (
    <div className="user-list-container">
      <h1>👥 User Directory</h1>
      <p className="count">Total Users: {users.length}</p>
      
      <div className="user-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-avatar">
              {user.name.charAt(0)}
            </div>
            <h3>{user.name}</h3>
            <p className="username">@{user.username}</p>
            <p className="email">✉️ {user.email}</p>
            <p className="phone">📱 {user.phone}</p>
            <p className="company">🏢 {user.company.name}</p>
            <p className="city">📍 {user.address.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
```

### Styling (UserList.css)
```css
.user-list-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 24px;
}

.error {
  color: #f44336;
}

.count {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.user-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  margin: 0 auto 15px;
}

.user-card h3 {
  margin: 10px 0;
  color: #333;
}

.username {
  color: #667eea;
  font-weight: 500;
  margin: 5px 0;
}

.email, .phone, .company, .city {
  font-size: 14px;
  color: #666;
  margin: 8px 0;
}
```

## 📊 More Examples

### Example 1: Posts List
```javascript
import { useState, useEffect } from 'react';

function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data.slice(0, 10)); // Get first 10 posts
        setLoading(false);
      });
  }, []);
  
  if (loading) return <p>Loading...</p>;
  
  return (
    <div>
      <h1>📄 Blog Posts</h1>
      {posts.map(post => (
        <div key={post.id} className="post">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Search with API
```javascript
import { useState } from 'react';

function UserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleSearch = async () => {
    if (!query) return;
    
    setLoading(true);
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?name_like=${query}`
    );
    const data = await response.json();
    setResults(data);
    setLoading(false);
  };
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
      />
      <button onClick={handleSearch}>Search</button>
      
      {loading && <p>Searching...</p>}
      
      {results.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Example 3: Random Quote Generator
```javascript
import { useState } from 'react';

function QuoteGenerator() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
    setLoading(false);
  };
  
  return (
    <div className="quote-container">
      <h1>💭 Random Quote Generator</h1>
      <button onClick={fetchQuote} disabled={loading}>
        {loading ? 'Loading...' : 'Get New Quote'}
      </button>
      
      {quote && (
        <div className="quote">
          <p className="quote-text">"{quote.content}"</p>
          <p className="quote-author">— {quote.author}</p>
        </div>
      )}
    </div>
  );
}
```

## 🎯 Practice Tasks

### Task 1: Display Photos
Fetch and display photos from: `https://jsonplaceholder.typicode.com/photos?_limit=12`

### Task 2: Comments Section
Build a component that fetches and displays comments.

### Task 3: Weather App (Optional)
Use a weather API to show current weather (requires API key).

### Task 4: Todo API
Fetch todos from API and display with delete functionality.

## 🧩 Best Practices

### 1. Handle Loading States
```javascript
{loading ? <Spinner /> : <Data />}
```

### 2. Handle Errors
```javascript
try {
  // fetch code
} catch (error) {
  setError(error.message);
}
```

### 3. Cleanup
```javascript
useEffect(() => {
  let cancelled = false;
  
  const fetchData = async () => {
    const data = await fetch('...');
    if (!cancelled) {
      setData(data);
    }
  };
  
  fetchData();
  
  return () => {
    cancelled = true; // Cleanup
  };
}, []);
```

## 📚 Free APIs to Practice

- JSONPlaceholder: https://jsonplaceholder.typicode.com/
- Random User: https://randomuser.me/api/
- Quotable: https://api.quotable.io/random
- Dog API: https://dog.ceo/api/breeds/image/random
- Cat Facts: https://catfact.ninja/fact

## 🧩 Checkpoint Quiz

1. **When should you fetch data in React?**
   - [ ] In the component body
   - [x] Inside useEffect
   - [ ] In useState
   - [ ] In render

2. **What does useEffect's dependency array do?**
   - [ ] Lists all variables
   - [x] Controls when effect runs
   - [ ] Stores data
   - [ ] Nothing

3. **What does async/await do?**
   - [ ] Makes code faster
   - [x] Handles promises in a cleaner way
   - [ ] Creates loops
   - [ ] Manages state

4. **Should you show a loading state?**
   - [x] Yes, always for better UX
   - [ ] No, never needed
   - [ ] Only for slow APIs
   - [ ] Optional

## 🚀 Next Steps
Once you can fetch and display data, you're ready for:
**Iteration 10: Mini Project** → Build a complete Notes App!

---

💡 **Tip**: Always handle loading and error states for better user experience!
