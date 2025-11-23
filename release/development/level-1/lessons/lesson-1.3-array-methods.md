# 📘 Lesson 1.3 - Array Methods (map, filter, reduce)

## 🎯 Learning Objectives

By the end of this lesson, you will understand:

- Why array methods are powerful in React
- How to use `.map()` to transform arrays into JSX
- How to use `.filter()` to select specific items
- How to use `.reduce()` to calculate totals
- Building dynamic lists from data

---

## 🤔 Why Array Methods?

In React, you'll often have arrays of data (users, products, posts) that you need to display. Array methods help you transform data into UI automatically!

### The Old Way (❌ Repetitive):

```jsx
<ul>
  <li>{users[0]}</li>
  <li>{users[1]}</li>
  <li>{users[2]}</li>
  {/* What if you have 100 users? */}
</ul>
```

### The React Way (✅ Dynamic):

```jsx
<ul>
  {users.map((user) => (
    <li>{user}</li>
  ))}
</ul>
```

---

## 🗺️ The .map() Method

**`.map()`** transforms each item in an array into something new.

### Basic Syntax:

```javascript
array.map((item) => {
  // Do something with item
  return newItem;
});
```

---

### Example 1: Simple Name List

```jsx
function App() {
  const names = ["Alice", "Bob", "Charlie"];

  return (
    <div className="container">
      <h2>Team Members</h2>
      <ul>
        {names.map((name) => (
          <li>{name}</li>
        ))}
      </ul>
    </div>
  );
}
```

**🔬 Try in Practice Lab** ⬆️

---

### Example 2: Mapping Objects with Keys

**⚠️ Important:** When using `.map()` in React, each item needs a unique `key` prop.

```jsx
function App() {
  const users = [
    { id: 1, name: "Alice", age: 25, role: "Developer" },
    { id: 2, name: "Bob", age: 30, role: "Designer" },
    { id: 3, name: "Charlie", age: 22, role: "Manager" },
  ];

  return (
    <div className="container">
      <h1>Team Directory</h1>
      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>
            Age: {user.age} | Role: {user.role}
          </p>
        </div>
      ))}
    </div>
  );
}
```

**🔬 Try in Practice Lab** ⬆️

---

## 🔍 The .filter() Method

**`.filter()`** selects only items that match a condition.

### Basic Syntax:

```javascript
array.filter((item) => {
  // Return true to keep item, false to remove
  return condition;
});
```

---

### Example 3: Filter by Age

```jsx
function App() {
  const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 17 },
    { name: "Charlie", age: 30 },
  ];

  // Get only users 18 or older
  const adults = users.filter((user) => user.age >= 18);

  return (
    <div className="container">
      <h2>Adult Users (18+)</h2>
      <ul>
        {adults.map((user) => (
          <li key={user.name}>
            {user.name} - {user.age} years
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**🔬 Try in Practice Lab** ⬆️

---

## 🧮 The .reduce() Method

**`.reduce()`** combines all array items into a single value (like calculating totals).

### Basic Syntax:

```javascript
array.reduce((accumulator, item) => {
  return accumulator + item;
}, startingValue);
```

---

### Example 4: Calculate Total with Reduce

```jsx
function App() {
  const prices = [10, 25, 30, 15];

  const total = prices.reduce((sum, price) => sum + price, 0);

  return (
    <div className="container">
      <h2>Shopping Cart</h2>
      <ul>
        {prices.map((price, index) => (
          <li key={index}>
            Item {index + 1}: ${price}
          </li>
        ))}
      </ul>
      <h3>Total: ${total}</h3>
    </div>
  );
}
```

**🔬 Try in Practice Lab** ⬆️

---

## 🎯 Combining Multiple Methods

You can chain methods together!

### Example 5: Chaining Methods (Filter + Map)

```jsx
function App() {
  const products = [
    { name: "Laptop", price: 800, inStock: true },
    { name: "Mouse", price: 25, inStock: false },
    { name: "Keyboard", price: 50, inStock: true },
  ];

  return (
    <div className="container">
      <h2>Available Products</h2>
      <ul>
        {products
          .filter((product) => product.inStock)
          .map((product) => (
            <li key={product.name}>
              {product.name} - ${product.price}
            </li>
          ))}
      </ul>
    </div>
  );
}
```

**🔬 Try in Practice Lab** ⬆️

---

## ✅ Practice Exercise

Create an array of students with `name`, `age`, and `grade`.

- Use `.map()` to display all students
- Use `.filter()` to show only students with grade > 70
- Use `.reduce()` to calculate average grade

---

## 🎯 Key Takeaways

✅ **`.map()` transforms every item in an array**  
✅ **Use `.map()` to create JSX lists dynamically**  
✅ **Always add `key` prop when using `.map()` in React**  
✅ **`.filter()` selects items based on a condition**  
✅ **`.reduce()` combines all items into one value**  
✅ **You can chain methods: `.filter().map()`**

---

## 🚀 Next Lesson

In **Lesson 1.4**, you'll learn about **Components** - breaking your code into reusable pieces!

**Preview:**

```jsx
// Instead of everything in App.jsx
<UserCard name="Alice" age={25} />
<UserCard name="Bob" age={30} />
```

---

**Need Help?** Copy any example into your **Practice Lab** and experiment! 🧪
