# Lesson 4.5 - Advanced React Patterns & Performance

**Duration**: 60 minutes  
**Difficulty**: Advanced

---

## 🎯 Learning Objectives

1. ✅ Create custom hooks for reusable logic
2. ✅ Implement error boundaries for graceful error handling
3. ✅ Use React.memo and useMemo for performance
4. ✅ Add lazy loading and code splitting
5. ✅ Implement compound components pattern
6. ✅ Optimize re-renders with useCallback

---

## 🎣 Custom Hooks Library

### 1. useDebounce Hook

```javascript
import { useState, useEffect } from "react";

/**
 * Debounce a value - delay updates until user stops typing
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

**Usage in Search**:

```jsx
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    // API call only triggers after user stops typing for 500ms
    if (debouncedSearch) {
      searchAPI(debouncedSearch);
    }
  }, [debouncedSearch]);

  return <Input onChange={(e) => setSearchTerm(e.target.value)} />;
}
```

---

### 2. useLocalStorage Hook

```javascript
import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

---

### 3. useOnClickOutside Hook

```javascript
import { useEffect } from "react";

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
```

---

## 🛡️ Error Boundaries

Create `src/components/common/ErrorBoundary.jsx`:

```jsx
import React from "react";
import { Result, Button } from "antd";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Log to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle="We're sorry for the inconvenience. Please try refreshing the page."
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Usage**: Wrap your routes:

```jsx
<ErrorBoundary>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</ErrorBoundary>
```

---

## ⚡ Performance Optimization

### 1. React.memo

```jsx
import { memo } from "react";

// Only re-renders if props change
const MemberCard = memo(({ user }) => {
  return (
    <Card>
      <h3>{user.username}</h3>
      <p>{user.email}</p>
    </Card>
  );
});

export default MemberCard;
```

### 2. useMemo

```jsx
function MembersList({ users, filter }) {
  // Expensive filtering operation - only recalculates when deps change
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Complex filtering logic
      return user.role === filter;
    });
  }, [users, filter]);

  return filteredUsers.map((user) => <MemberCard key={user.id} user={user} />);
}
```

### 3. useCallback

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0);

  // Memoized callback - same reference across renders
  const handleClick = useCallback(() => {
    console.log("Clicked");
  }, []); // Dependencies

  return <ChildComponent onClick={handleClick} />;
}
```

---

## 📦 Lazy Loading & Code Splitting

```jsx
import { lazy, Suspense } from "react";
import { Spin } from "antd";

// Lazy load components
const Members = lazy(() => import("./pages/Members"));
const Profile = lazy(() => import("./pages/Profile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <Suspense fallback={<Spin size="large" fullscreen />}>
      <Routes>
        <Route path="/members" element={<Members />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

---

## 🎭 Compound Components Pattern

```jsx
// Flexible, composable Table component
function Table({ children }) {
  return <table>{children}</table>;
}

Table.Header = function TableHeader({ children }) {
  return <thead>{children}</thead>;
};

Table.Body = function TableBody({ children }) {
  return <tbody>{children}</tbody>;
};

Table.Row = function TableRow({ children }) {
  return <tr>{children}</tr>;
};

Table.Cell = function TableCell({ children }) {
  return <td>{children}</td>;
};

// Usage
<Table>
  <Table.Header>
    <Table.Row>
      <Table.Cell>Name</Table.Cell>
      <Table.Cell>Email</Table.Cell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>John</Table.Cell>
      <Table.Cell>john@example.com</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>;
```

---

## 🎯 Practice Exercise

**Task**: Create Performance Dashboard

Requirements:

1. Use `useDebounce` for search
2. Use `useMemo` for expensive calculations
3. Add `ErrorBoundary` to all routes
4. Lazy load all pages
5. Memoize expensive list rendering

---

## ➡️ Next Lesson

[Lesson 6: Production-Ready Features](./lesson-6-production.md)

Learn production deployment, optimistic updates, and analytics!
